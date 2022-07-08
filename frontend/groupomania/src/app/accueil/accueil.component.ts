import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../core/models/post.model';
import { User } from '../core/models/user.model';
import { PostService } from '../core/services/post.services';
import { UserService } from '../core/services/user.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Comment } from '../core/models/comment.model';
import { AppComponentDialog } from '../dialog.component/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoggedInUserId } from '../core/models/loggedInUserId.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  posts!: Post[];
  post!: Post;
  loggedInUser!: User | null;
  loggedInUserId!: LoggedInUserId | null;
  users: User[] = [];
  comment!: Comment;
  commentForm!: FormGroup;

  constructor(private router: Router,
     private postService: PostService,
     private userService: UserService, 
     private snackBar: MatSnackBar,
     private dialog: MatDialog,
     private fb: FormBuilder ) { }

  ngOnInit() {
    this.commentForm = this.fb.group({
      text: ['']
    });

    if (localStorage.getItem('loggedInUserId')===null) {
      this.loggedInUserId = null;
    }
    else {
      this.loggedInUserId = JSON.parse(localStorage.getItem('loggedInUserId') || '{}');
    };
    this.getPosts();
    this.getLoggedInUser();
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

  //récupérer l'identité du user qui a poster
  getPosterName(posterId: string) : string {
    let name: string = "";
    for (let user of this.users) {
      if (user?._id === posterId) {
        name = user?.firstname +" "+ user?.name;
      }
    }
    return name;
  }

  //Afficher tous les posts
  getPosts() {
    this.postService.getPosts().subscribe(
      (response: Post[]) => {
        this.posts = [];
        this.posts = response;
        this.posts.sort((a, b) => b.createdAt!.localeCompare(a.createdAt!));
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  //Ajouter un post
  addPost(post: Post) {
    post.posterId=this.loggedInUser?._id!;
    this.postService.addPost(post).subscribe(
      (response: Post) => {
        this.getPosts();
        location.reload();
        this.snackBar.open("Message publié", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  //aimer un post
  likePost(postId: string) {
    this.postService.likePost(postId,this.loggedInUser?._id!).subscribe(
      (response: Post) => {
        this.getPosts();
        this.snackBar.open("Vous aimez cette publication", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  //ne plus aimer un post
  unlikePost(postId: string) {
    this.postService.unlikePost(postId,this.loggedInUser?._id!).subscribe(
      (response: Post) => {
        this.getPosts();
        this.snackBar.open("Vous n'aimez plus cette publication", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  //Indique nombre de commentaires d'un post
  getCommentsNumber(post : Post): number {
    let commentsNumber: number = 0;
    if (post?.comments?.length) {
      commentsNumber = post?.comments?.length;
    }
    return commentsNumber;
  }

  //Indique nombre de likes d'un post
  getLikesNumber(post : Post): number {
    let likesNumber: number = 0;
    if (post?.likers?.length) {
      likesNumber = post?.likers?.length;
    }
    return likesNumber;
  }

  //indique si l'utilisateur a liker
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
      comment.commenterId = this.loggedInUser?._id!;
      this.postService.addCommentPost(postId, comment).subscribe(
        (response: Post) => {
          this.getPosts();
          this.snackBar.open("Commentaire publié", "Fermer", {duration: 2000});
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
  editCommentPost(postId: string, commentId: any) {
    this.postService.editCommentPost(postId,commentId).subscribe(
      (response: Post) => {
        this.getPosts();
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
            this.getPosts();
            this.snackBar.open("Commentaire supprimé", "Fermer", {duration: 2000});
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    });
  };
  //déconnecter l'utilisateur connecté (à tester)
  logoutUser(user : User) {
    this.userService.logoutUser(user).subscribe(
      (response: User) => {
        localStorage.removeItem('loggedInUser');
        this.loggedInUser = null;
        //éventuellement renvoyer à la page de connexion
      }
    )
  };

  //Barre de recherche de posts
  searchPosts(key: string){
    const results: Post[] = [];
    for (const post of this.posts) {
      if (post.posterId?.toLowerCase().indexOf(key.toLowerCase())!== -1
      || post.message?.toLowerCase().indexOf(key.toLowerCase())!== -1) {
        results.push(post);
      }
    }
    this.posts = results;
    if (results.length === 0 ||!key) {
      this.getPosts();
    }
  };

}
