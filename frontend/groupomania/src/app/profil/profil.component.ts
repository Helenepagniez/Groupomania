import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../core/models/post.model';
import { User } from '../core/models/user.model';
import { PostService } from '../core/services/post.services';
import { UserService } from '../core/services/user.services';
import { MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  userPosts: Post[] = [];
  loggedInUser!: User | null;

  constructor(private router: Router,
    private postService: PostService,
    private userService: UserService,
    private matDialog: MatDialog) { }

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

  //Afficher tous les posts
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

  //supprimer l'utilisateur connecté
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
}
