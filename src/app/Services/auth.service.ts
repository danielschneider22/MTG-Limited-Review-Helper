import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database-deprecated'; 

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User =null;

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router,private db: AngularFireDatabase) { 
    this.user = _firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          this.addUserMetaData()
        }
        else {
          this.userDetails = null;
        }
      }
    );
  }

  signInWithTwitter() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider()
    )
  }

  signInWithFacebook() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    )
  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  signInRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential( email, password );

    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password)
  }

  addUserMetaData(){
    const obj = this.db.database.ref("userMetadata/" + this.userDetails.uid);
    obj.set({"displayName":this.userDetails.displayName});
  }

  //add account with email and password
  //then update that account to include first and last name of user
  createAccount(email,password,firstName,lastName){
    var accountCreatedPromise = new Promise((resolve,reject)=>{
      this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password).then(function(){
        var user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: firstName + " " + lastName,
          photoURL: ""
        }).then(function(){
          resolve(true);
        }).catch(function(error){
          reject();
        });
      });
    })
    
    return accountCreatedPromise;
    
  }

  //return promise whether a user is logged in or not
  isLoggedIn() {
    return this.user;
  }

  //return promise whether a user is logged in or not in real time
  isLoggedInBoolean() {
    return this.userDetails ? true: false;
  }

  //returns all details of a user
  getUserDetails(){
    return this.userDetails;
  }
  
  
  logout() {
    this._firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['']));
  }


}
