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

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  userPosts: Post[] = [];
  loggedInUser!: User | null;
  comment!: Comment;

  constructor(private router: Router,
    private postService: PostService,
    private userService: UserService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    if (localStorage.getItem('loggedInUser')===null) {
      this.loggedInUser = null;
    }
    else {
      this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    };
    this.getUserPosts();
    this.loggedInUser={
      "_id": "62b58703cf8fe478d3f52b03",
      "email": "patrice@gmail.com",
      "picture": "./uploads/profil/random-user.png",
      "follower": null,
      "following": null,
      "job": "Business Analyst",
      "firstname": "Patrice",
      "name": "Dupont",
      "password": "test33",
      "role": "CLIENT"
    }
  };

  //Afficher les posts de l'utilisateur
  getUserPosts() {
    this.postService.getPosts().subscribe(
      (response: Post[]) => {
        if (response !== []) {
          for (let post of response) {
            if (post?.posterId === this.loggedInUser?._id) {
              this.userPosts.unshift(post);
              this.userPosts.sort((a, b) => b.updatedAt!.localeCompare(a.updatedAt!));
            }
          }
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  //modifier les posts de l'utilisateur (à revérifier et essayer avec ajout du bouton)
  updatePost(postId: number, posterId: string) {
    if (posterId.toString() === this.loggedInUser?._id) {
      this.postService.updatePost(postId, posterId).subscribe(
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
      if (result === true && posterId === this.loggedInUser?._id) {
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
  updateUser(user : User, userId: number) {
    if (this.loggedInUser?.role === "ADMIN") {
      user.role="ADMIN";
    }
    else {
      user.role="CLIENT";
    }
    this.userService.updateUser(user, userId).subscribe(
      (response: User) => {
        localStorage.setItem('loggedInUser', JSON.stringify(response));
        this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  //supprimer l'utilisateur connecté (à tester)
  deleteUser(userId: number) {
    if (userId.toString() === this.loggedInUser?._id) {
      this.userService.deleteUser(userId).subscribe(
        (response: void) => {
          this.loggedInUser=null;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
  };

  
  //aimer un post (à assembler avec unlikePost + ajout au html et css)
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

  //ne plus aimer un post (à assembler avec likePost + ajout au html et css)
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

  
  //ajouter un commentaire ( ajout au html et css)
  addCommentPost(postId: string, comment: Comment) {
    if (comment?.text !== null && comment?.text !== "") {
      comment.commenterName = this.loggedInUser?.firstname! +" "+ this.loggedInUser?.name!;
      comment.commenterId = this.loggedInUser?._id!;
      this.postService.addCommentPost(postId, comment).subscribe(
        (response: Post) => {
          this.getUserPosts();
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

  //modifier un commentaire (à revérifier + ajout au html et css)
  editCommentPost(postId: string, commentId: any) {
    this.postService.editCommentPost(postId,commentId).subscribe(
      (response: Post) => {
        this.getUserPosts();
        this.snackBar.open("Commentaire modifié", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  //supprimer un commentaire (ajout au html et css)
  deleteCommentPost(postId: string, commentId: any) {
    const dialogRef = this.dialog.open(AppComponentDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.postService.deleteCommentPost(postId,commentId).subscribe(
          (response: Post) => {
            this.getUserPosts();
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
