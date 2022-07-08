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
import { FormBuilder, FormGroup } from '@angular/forms';

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
      firstname: [''],
      name: [''],
      job: [''],
      email: [''],
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

  getPosterName(posterId: string) : string {
    let name: string = "";
    for (let user of this.users) {
      if (user?._id === posterId) {
        name = user?.firstname +" "+ user?.name;
      }
    }
    return name;
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

  //Modifier l'utilisateur connecté (à tester)
  updateUser(user : User) {
    if (this.loggedInUser?.role === "ADMIN") {
      user.role="ADMIN";
    }
    else {
      user.role="CLIENT";
    }
    this.userService.updateUser(user, user?._id).subscribe(
      (response: User) => {
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
  
  //aimer un post (à assembler avec unlikePost)
  likePost(postId: string) {
    this.postService.likePost(postId,this.loggedInUserId?.user!).subscribe(
      (response: Post) => {
        this.snackBar.open("Vous aimez cette publication", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  //ne plus aimer un post (à assembler avec likePost)
  unlikePost(postId: string) {
    this.postService.unlikePost(postId,this.loggedInUserId?.user!).subscribe(
      (response: Post) => {
        this.snackBar.open("Vous n'aimez plus cette publication", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  
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

  //modifier un commentaire (à revérifier)
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
    )
  };
}
