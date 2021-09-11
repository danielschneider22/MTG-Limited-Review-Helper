import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public authService: AuthService,private router: Router,private toastr: ToastrService) { }

  isCollapsed = true;

  ngOnInit() {
  }

  logout(){
    this.authService.logout();
    this.toastr.success('',"Logged out", {
      timeOut: 3000,
      positionClass:'toast-top-center'
    });
    this.collapseMenu();
  }

  collapseMenu(){
    this.isCollapsed = true;
  }

  toggleMenu(){
    this.isCollapsed = !this.isCollapsed;
  }

}
