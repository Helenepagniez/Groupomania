import { style } from '@angular/animations';
import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.services';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {
  registerActive: boolean = false;
  loginActive : boolean = true;

  constructor(private auth: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    
    let button : any = document.querySelector(".section");
    button.onclick = function(){
      this.classList.toggle("active");
    }
  }

  onLogin() {
  this.auth.login();
  this.router.navigateByUrl('/accueil');
  }

  onRegisterPage(){
    this.registerActive = true;
    this.loginActive = false;
  }

  onLoginPage(){
    this.registerActive = false;
    this.loginActive = true;
  }
}

