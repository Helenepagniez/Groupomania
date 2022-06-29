import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../core/models/post.model';
import { User } from '../core/models/user.model';
import { PostService } from '../core/services/post.services';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  posts: Post[] = [];
  userPosts: Post[] = [];
  post!: Post;
  loggedInUser!: User | null;

  constructor(private router: Router,
    private postService: PostService) { }

  ngOnInit(): void {
    if (localStorage.getItem('loggedInUser')===null) {
      this.loggedInUser = null;
    }
    else {
      this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    };

    this.getUserPosts();
  };

  //Afficher tous les posts
  getUserPosts() {
    this.postService.getPosts().subscribe(
      (response: Post[]) => {
        if (response !== []) {
          for (let post of response) {
            if (post?.posterId === "62b58703cf8fe478d3f52b03") {
              this.userPosts.unshift(post);
            }
          }
        }
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
        this.getUserPosts();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };
}
