import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.services';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  
  user!: User;
  users!: User[];
  loggedInUser!: User | null;

  constructor(private router: Router,
     private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  //Afficher tous les utilisateurs
  getUsers() {
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
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
