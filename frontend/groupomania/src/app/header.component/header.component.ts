import { Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInUserId } from '../core/models/loggedInUserId.model';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class AppHeaderComponent implements OnInit{
  user!: User;
  loggedInUserId!: string | null;

  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('loggedInUserId')===null) {
      this.loggedInUserId = null;
    }
    else {
      this.loggedInUserId = JSON.parse(localStorage.getItem('loggedInUserId') || '{}');
    };
  }
  
  @Input() title = 'groupomania';
}

