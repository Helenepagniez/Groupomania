import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../core/models/post.model';
import { User } from '../core/models/user.model';
import { PostService } from '../core/services/post.services';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  posts!: Post[];
  post!: Post;
  loggedInUser!: User | null;

  constructor(private router: Router, private postService: PostService ) { }

  ngOnInit() {
    if (localStorage.getItem('loggedInUser')===null) {
      this.loggedInUser = null;
    }
    else {
      this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    };

    this.getPosts();
  };

  //Afficher tous les posts
  getPosts() {
    this.postService.getPosts().subscribe(
      (response: Post[]) => {
        this.posts = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  //Ajouter un post
  addPost(post: Post) {
    this.postService.addPost(post).subscribe(
      (response: Post) => {
        this.getPosts();
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

  //supprimer un post
  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe(
      (response: void) => {
        this.getPosts();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  ajouterPost() {
    if(this.loggedInUser === null) {
      //alert("Veuillez vous connecter");
    } else {
    }
    const post: Post = {
      "_id": null,
      "picture": null,
      "video": null,
      "likers": null,
      "posterId": "62b58703cf8fe478d3f52b03",
      "message": "Ecrivez un post"
    }
    this.addPost(post);
  };

  supprimerPost(postId: number) {
    this.deletePost(postId);
  }
}
