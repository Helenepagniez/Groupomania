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
    post.posterId="62b58703cf8fe478d3f52b03";
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
}
