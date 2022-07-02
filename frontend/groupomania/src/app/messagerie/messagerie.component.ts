import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.services';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.css']
})
export class MessagerieComponent implements OnInit {
  user!: User;
  users!: User[];
  loggedInUser!: User | null;

  constructor(private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
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

}
