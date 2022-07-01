import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../core/models/post.model';
import { User } from '../core/models/user.model';
import { PostService } from '../core/services/post.services';
import { UserService } from '../core/services/user.services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  posts!: Post[];
  post!: Post;
  loggedInUser!: User | null;

  constructor(private router: Router,
     private postService: PostService,
     private userService: UserService, private snackBar: MatSnackBar ) { }

  ngOnInit() {
    if (localStorage.getItem('loggedInUser')===null) {
      this.loggedInUser = null;
    }
    else {
      this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    };
    this.getPosts();
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
    };
    
  };

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
        this.snackBar.open("Message publié", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  //modifier un post
  updatePost(post: Post, postId: number) {
    this.postService.updatePost(post, postId).subscribe(
      (response: Post) => {
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  /*
  //déconnecter un utilisateur
  logoutUser(user : User) {
    this.userService.logoutUser(user).subscribe(
      (response: User) => {
        localStorage.removeItem('loggedInUser');
        this.loggedInUser = null;
        //éventuellement renvoyer à la page de connexion
      }
    )
  };
  */
}
