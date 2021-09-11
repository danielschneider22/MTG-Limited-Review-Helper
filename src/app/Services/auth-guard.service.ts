import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthGuardService  implements CanActivate{

    constructor(private router: Router,private authService: AuthService,private toastr: ToastrService) { }

    canActivate():Observable<boolean> | boolean {
      var that = this;

      return ((this.authService.isLoggedIn()).map(user => {
        if(user)
          return true;
        else{
          that.toastr.info('',"Login to access your limited set reviews", {
            timeOut: 5000,
          });
          that.router.navigate(['dashboard/login']);
          return false;
        }
      }));
    }

  }
