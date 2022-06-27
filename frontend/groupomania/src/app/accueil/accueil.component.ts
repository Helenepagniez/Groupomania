import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../core/models/post.model';
import { PostService } from '../core/services/post.services';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  posts!: Post[];
  post!: Post;

  constructor(private router: Router, private postService: PostService ) { }

  ngOnInit() {
    this.getPosts();
  };

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

  addPost(post: Post) {
    this.postService.addPost(post).subscribe(
      (response: Post) => {
        this.post = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  updatePost(post: Post, postId: number) {
    this.postService.updatePost(post, postId).subscribe(
      (response: Post) => {
        this.post = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };
/*
  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe(
      (response: PostId) => {
        this.post = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };
  */
}
