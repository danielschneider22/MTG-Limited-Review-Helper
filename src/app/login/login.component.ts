import { Component, OnInit } from '@angular/core';// src/app/views/login/login.component.ts
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    email: '',
    password: ''
 };

  constructor(private authService: AuthService, private router: Router,private toastr: ToastrService) {}

  loginToastrMessage(){
    this.toastr.clear();
    this.toastr.success(''," Logged In", {
      timeOut: 2000,
      positionClass:'toast-top-center'
    });
  }
  
  signInWithTwitter() {
    this.authService.signInWithTwitter().then((res) => { 
      this.loginToastrMessage();
      this.router.navigate(['dashboard/yourLimitedSetReviews'])
      })
    .catch(
        (err) => {
          console.log('error: ' + err);
          this.toastr.error(err,"Error Signing in", {
            timeOut: 5000,
            positionClass:'toast-top-center'
          });
      }
    );
  }

  signInWithFacebook() {
    this.authService.signInWithFacebook()
    .then((res) => {
        this.loginToastrMessage();
        this.router.navigate(['dashboard/yourLimitedSetReviews'])
      })
      .catch(
        (err) => {
          console.log('error: ' + err);
          this.toastr.error(err,"Error Signing in", {
            timeOut: 5000,
            positionClass:'toast-top-center'
          });
      }
      );
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then((res) => {
        this.loginToastrMessage();
        this.router.navigate(['dashboard/yourLimitedSetReviews'])
      })
      .catch(
        (err) => {
          console.log('error: ' + err);
          this.toastr.error(err,"Error Signing in", {
            timeOut: 5000,
            positionClass:'toast-top-center'
          });
      }
      );
  }

  signInWithEmail() {
    this.authService.signInRegular(this.user.email, this.user.password)
      .then((res) => {
        this.loginToastrMessage();
        this.router.navigate(['dashboard/yourLimitedSetReviews']);
      })
      .catch(
        (err) => {
          console.log('error: ' + err);
          this.toastr.error(err,"Error Signing in", {
            timeOut: 5000,
            positionClass:'toast-top-center'
          });
      }
      );
  }

  createAccount(){
    this.router.navigate(['dashboard/login/createAccount']);
  }

  ngOnInit() {
  }

}
