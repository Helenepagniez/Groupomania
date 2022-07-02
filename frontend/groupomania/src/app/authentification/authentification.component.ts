import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../core/models/user.model';
import { AuthService } from '../core/services/auth.services';
import { UserService } from '../core/services/user.services';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {

  user!: User;
  users!: User[];
  signinForm!: FormGroup;
  loginForm!: FormGroup;
  registerActive: boolean = false;
  loginActive : boolean = true;
  loggedInUser!: User | null;


  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userService: UserService){}

  ngOnInit() {
    this.signinForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      firstname: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]]
    });

    let button : any = document.querySelector(".section");
    button.onclick = function(){
      this.classList.toggle("active");
    };

    if (localStorage.getItem('loggedInUser')===null) {
      this.loggedInUser = null;
    }
    else {
      this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    }

    this.getUsers();
    
  };
  
  register(user: User){

  };

  onLogin() {
  this.auth.login();
  this.router.navigateByUrl('/accueil');
  };

  onRegisterPage(){
    document.getElementById("register")?.classList.add("active");
    document.getElementById("login")?.classList.remove("active");
    this.registerActive = true;
    this.loginActive = false;
  };

  onLoginPage(){
    location.reload();
  };

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

  //Ajouter un utilisateur
  addUser(user : User) {
    user.role="CLIENT";
    this.userService.addUser(user).subscribe(
      (response: User) => {
        this.loginUser(response);
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  //Modifier un utilisateur
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

  //supprimer un utilisateur
  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(
    (response: void) => {
      this.getUsers();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
  };

  //connecter un utilisateur
  loginUser(user : User) {    
    this.userService.loginUser(user).subscribe(
      (response: User) => {
        localStorage.setItem('loggedInUser', JSON.stringify(response));
        this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        location.href="/accueil";
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

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
}
