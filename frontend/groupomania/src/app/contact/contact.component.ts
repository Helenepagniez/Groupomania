import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoggedInUserId } from '../core/models/loggedInUserId.model';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.services';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  
  user!: User;
  users: User[] = [];
  loggedInUserId!: LoggedInUserId | null;
  loggedInUser!: User | null;

  constructor(private router: Router,
     private userService: UserService,
     private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (localStorage.getItem('loggedInUserId')===null) {
      this.loggedInUserId = null;
    }
    else {
      this.loggedInUserId = JSON.parse(localStorage.getItem('loggedInUserId') || '{}');
    };
    this.getLoggedInUser();
  }

  getFollowersNumber(): number {
    let followerNumber: number = 0;
    if (this.loggedInUser?.followers?.length) {
      followerNumber = this.loggedInUser?.followers?.length;
    }
    return followerNumber;
  }

  isFollowing(user : User) : boolean {
    let isFollowing: boolean = false;
    if (this.loggedInUser?.following?.length) {
      for (let followingUser of this.loggedInUser?.following) {
        if (followingUser === user?._id) {
          isFollowing = true;
        }
      }
    }
    return isFollowing;
  }

  //récupère l'utilisateur connecté
  getLoggedInUser() {
    this.userService.getUsers().subscribe(
      (response: User[]) => { 
        this.users = []; 
        for (let user of response) {
          if (user?._id !== this.loggedInUserId?.user) {
            this.users.unshift(user);
          }
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

  //suivre quelqu'un (à tester)
  followUser(IdToFollow: string){
    this.userService.followUser(this.loggedInUserId?.user!, IdToFollow).subscribe(
      (response: User) => {
        this.getLoggedInUser();
        this.snackBar.open("Vous suivez cet utilisateur", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };

  //ne plus suivre quelqu'un (à tester)
  unfollowUser(IdToFollow: string){
    this.userService.unfollowUser(this.loggedInUserId?.user!, IdToFollow).subscribe(
      (response: User) => {
        this.getLoggedInUser();
        this.snackBar.open("Vous ne suivez plus cet utilisateur", "Fermer", {duration: 2000});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  };
  
}
