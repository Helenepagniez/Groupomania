import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../core/models/user.model';
import { AuthService } from '../core/services/auth.services';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {

  user!: User;
  signinForm!: FormGroup;
  loginForm!: FormGroup;
  registerActive: boolean = false;
  loginActive : boolean = true;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router){}

  ngOnInit() {
    this.signinForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      firstname: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]]
    })

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]]
    })

    let button : any = document.querySelector(".section");
    button.onclick = function(){
      this.classList.toggle("active");
    }
  }
  
  register(user: User){

  }

  login(user: User){

  }

  onLogin() {
  this.auth.login();
  this.router.navigateByUrl('/accueil');
  }

  onRegisterPage(){
    document.getElementById("register")?.classList.add("active");
    document.getElementById("login")?.classList.remove("active");
    this.registerActive = true;
    this.loginActive = false;
  }

  onLoginPage(){
    location.reload();
  }
  
}
