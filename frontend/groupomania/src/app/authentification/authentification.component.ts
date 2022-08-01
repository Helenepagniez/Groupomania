import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoggedInUserId } from '../core/models/loggedInUserId.model';
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
  users: User[]=[];
  signinForm!: FormGroup;
  loginForm!: FormGroup;
  registerActive: boolean = false;
  loginActive : boolean = true;
  loggedInUser!: User | null;
  loggedInUserId!: LoggedInUserId | null;


  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService){}

  ngOnInit() {
    this.signinForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      firstname: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      job: ['', [Validators.required,Validators.maxLength(50)]],
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

    if (localStorage.getItem('loggedInUserId')===null) {
      this.loggedInUserId = null;
    }
    else {
      this.loggedInUserId = JSON.parse(localStorage.getItem('loggedInUserId') || '{}');
    }
    
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

  //connecter un utilisateur
  loginUser(user : User) {    
    this.userService.loginUser(user).subscribe(
      (response: any) => {
        if (response?.user) {
          localStorage.setItem('loggedInUserId', JSON.stringify(response));
          this.loggedInUserId = JSON.parse(localStorage.getItem('loggedInUserId') || '{}');
          location.href="/accueil";
        }
        else {
          alert("Mauvais mot de passe ou email");
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  //récupérer les utilisateurs
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
    user.picture=null;
    this.userService.addUser(user).subscribe(
      (response: User) => {
        this.loginUser(user);
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };
}
