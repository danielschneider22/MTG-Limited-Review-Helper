import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  user = {
    email: '',
    password: '',
    firstName:'',
    lastName:''
 };

  constructor(private authService: AuthService, private router: Router,private toastr: ToastrService) { }

  ngOnInit() {
  }

  createAccount(){
    this.authService.createAccount(this.user.email, this.user.password,this.user.firstName,this.user.lastName).then((res) => {
      this.toastr.clear();
      this.toastr.success(''," Logged In", {
        timeOut: 2000,
        positionClass:'toast-top-center'
      });
      this.router.navigate(['dashboard/yourLimitedSetReviews']);
    })
    .catch((err) => console.log('error: ' + err));
  }

}
