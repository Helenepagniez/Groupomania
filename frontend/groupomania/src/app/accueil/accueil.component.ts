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

  constructor(private router: Router,
     private postService: PostService,
     private userService: UserService, 
     private snackBar: MatSnackBar,
     private dialog: MatDialog ) { }

  ngOnInit() {
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
        this.posts = response;
        this.posts.sort((a, b) => b.updatedAt!.localeCompare(a.updatedAt!));
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

  //aimer un post (à assembler avec unlikePost)
  likePost(postId: string) {
    this.postService.likePost(postId,this.loggedInUser?._id!).subscribe(
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
    this.postService.unlikePost(postId,this.loggedInUser?._id!).subscribe(
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
    if (comment?.text !== null && comment?.text !== "") {
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

  //modifier un commentaire (à revérifier)
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
}
