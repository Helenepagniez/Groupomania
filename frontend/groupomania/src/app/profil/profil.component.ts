import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../core/models/post.model';
import { User } from '../core/models/user.model';
import { Comment } from '../core/models/comment.model';
import { PostService } from '../core/services/post.services';
import { UserService } from '../core/services/user.services';
import { MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponentDialog } from '../dialog.component/dialog.component';
import { LoggedInUserId } from '../core/models/loggedInUserId.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  userPosts: Post[] = [];
  loggedInUser!: User | null;
  loggedInUserId!: LoggedInUserId | null;
  users: User[]=[];
  user!: User;
  comment!: Comment;
  userForm!: FormGroup;
  commentForm!: FormGroup;
  file!: File | null;
  imagePreview!: string|null;
  

  constructor(private router: Router,
    private postService: PostService,
    private userService: UserService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      _id: [''],
      firstname: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      job: [''],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      picture: [''],
      role: ['']
    });

    this.commentForm = this.fb.group({
      text: ['']
    });

    if (localStorage.getItem('loggedInUserId')===null) {
      this.loggedInUserId = null;
    }
    else {
      this.loggedInUserId = JSON.parse(localStorage.getItem('loggedInUserId') || '{}');
    };
    this.getUserPosts();
    this.getLoggedInUser();
  };

  //Afficher les posts de l'utilisateur
  getUserPosts() {
    this.postService.getPosts().subscribe(
      (response: Post[]) => {
        if (response !== []) {
          this.userPosts= [];
          for (let post of response) {
            if (post?.posterId === this.loggedInUserId?.user) {
              this.userPosts.unshift(post);
              this.userPosts.sort((a, b) => b.createdAt!.localeCompare(a.createdAt!));
            }
          }
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

   //récupère l'utilisateur connecté
   getLoggedInUser() {
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users=response;   
        for (let user of response) {
          if (user?._id === this.loggedInUserId?.user) {
            this.loggedInUser = user;
          }
        }   
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    ) 
  }

  //indiquer personne qui publie
  getPosterName(posterId: string) : string {
    let name: string = "";
    for (let user of this.users) {
      if (user?._id === posterId) {
        name = user?.firstname +" "+ user?.name;
      }
    }
    return name;
  }

  //récupérer la photo du user qui a poster
  getPosterPicture(posterId: string) : string|null {
    let picture: string|null = null;
    for (let user of this.users) {
      if (user?._id === posterId) {
        picture = user?.picture;
      }
    }
    return picture;
  }

  //modifier les posts de l'utilisateur
  updatePost(post: Post) {
    if (post?.posterId === this.loggedInUserId?.user) {
      this.postService.updatePost(post?._id, post).subscribe(
        (response: Post) => {
          this.snackBar.open("Message modifié", "Fermer", {duration: 2000});
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  };

  //supprimer les posts de l'utilisateur
  deletePost(postId: number, posterId: string) {
    const dialogRef = this.dialog.open(AppComponentDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true && posterId === this.loggedInUserId?.user) {
        this.postService.deletePost(postId).subscribe(
          (response: void) => {
            location.reload();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    });
  };

  submitUser() {
    const user = new User();
    user._id=this.loggedInUser?._id!;
    user.role = this.loggedInUser!.role;
    if (this.imagePreview) user.picture=this.imagePreview;
    if (this.userForm.get('firstname')!.value) user.firstname=this.userForm.get('firstname')!.value;
    if (this.userForm.get('name')!.value) user.name=this.userForm.get('name')!.value;
    if (this.userForm.get('job')!.value) user.job=this.userForm.get('job')!.value;
    if (this.userForm.get('email')!.value) user.email=this.userForm.get('email')!.value;
    this.updateUser(user);
  }

  //Modifier l'utilisateur connecté
  updateUser(user : User) {    
    this.userService.updateUser(user, user?._id).subscribe(
      (response: User) => {
        console.log(response);
        this.imagePreview=null;
        this.getLoggedInUser();
        this.snackBar.open("Vous avez modifié vos informations", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  //supprimer l'utilisateur connecté (à tester)
  deleteUser(userId: string) {
    const dialogRef = this.dialog.open(AppComponentDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.deleteUser(userId).subscribe(
          (response: void) => {
            localStorage.removeItem('loggedInUserId');
            this.loggedInUser = null;
            this.loggedInUserId = null;
            location.href="/";
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    });
  };
  
  //aimer un post 
  likePost(postId: string) {
    this.postService.likePost(postId,this.loggedInUserId?.user!).subscribe(
      (response: Post) => {
        this.getUserPosts();
        this.snackBar.open("Vous aimez cette publication", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  //ne plus aimer un post 
  unlikePost(postId: string) {
    this.postService.unlikePost(postId,this.loggedInUserId?.user!).subscribe(
      (response: Post) => {
        this.getUserPosts();
        this.snackBar.open("Vous n'aimez plus cette publication", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  //ajout nombre de commentaires à un post
  getCommentsNumber(post : Post): number {
    let commentsNumber: number = 0;
    if (post?.comments?.length) {
      commentsNumber = post?.comments?.length;
    }
    return commentsNumber;
  }

  //ajout nombre de likes à un post
  getLikesNumber(post : Post): number {
    let likesNumber: number = 0;
    if (post?.likers?.length) {
      likesNumber = post?.likers?.length;
    }
    return likesNumber;
  }

  //indique si déjà liker
  isLiking(post: Post) : boolean {
    let isLiking: boolean = false;
    for (let liker of post?.likers!) {
      if (this.loggedInUser?._id === liker) {
        isLiking = true;
      }
    }
    return isLiking;
  }
  
  //ajouter un commentaire 
  addCommentPost(postId: string, comment: Comment) {
    console.log(comment);
    if (comment?.text !== null && comment?.text !== "" && comment?.text !== undefined) {
      comment.commenterName = this.loggedInUser?.firstname! +" "+ this.loggedInUser?.name!;
      comment.commenterId = this.loggedInUserId?.user!;
      this.postService.addCommentPost(postId, comment).subscribe(
        (response: Post) => {
          this.snackBar.open("Commentaire publié", "Fermer", {duration: 2000}).afterDismissed().subscribe(() => {
            location.reload();
          });
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
    else {
      alert ("commentaire vide");
    }
  };

  //modifier un commentaire 
  editCommentPost(postId: string, comment: Comment) {
    this.postService.editCommentPost(postId,comment).subscribe(
      (response: Post) => {
        this.getUserPosts();
        this.snackBar.open("Commentaire modifié", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  //supprimer un commentaire
  deleteCommentPost(postId: string, commentId: any) {
    const dialogRef = this.dialog.open(AppComponentDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.postService.deleteCommentPost(postId,commentId).subscribe(
          (response: Post) => {
            this.snackBar.open("Commentaire supprimé", "Fermer", {duration: 2000}).afterDismissed().subscribe(() => {
              location.reload();
            });
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    });
  };

  //déconnecter l'utilisateur connecté (à tester)
  logoutUser() {
    this.userService.logoutUser(this.loggedInUser!).subscribe(
      (response: User) => {
        localStorage.removeItem('loggedInUserId');
        this.loggedInUser = null;
        this.loggedInUserId = null;
        location.href="/";
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  onFileAdded(event: Event) {
    console.log('onFileAdded');
      const file = (event.target as HTMLInputElement).files![0];
      this.file=file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }  
}
