import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable } from 'angularfire2/database-deprecated'; 
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs';

@Injectable()
export class RatingsService {

  private basePath = '/userRatings';
  private setEditorsPath = '/setRaters';

  public items: any;
  public item: any;
  constructor(private db: AngularFireDatabase,private authService: AuthService) { }

  saveAllRatedCards(cardArray,setName){
    for(var i in cardArray){
      this.addRatedCard(cardArray[i],setName);
    }
  }

  addRatedCard(card,setName) {
    var userDetails = this.authService.getUserDetails();
    const userRatingsPath = this.db.database.ref(this.basePath +"/" + userDetails.uid + "/" + setName + '/' + card.name);
    userRatingsPath.set(card);

    const setRatersPath = this.db.database.ref(this.setEditorsPath +"/" + setName + '/' + userDetails.uid);
    setRatersPath.set({"reviewed":true,"hidden":false,"displayName":userDetails.displayName});
  }

  getAllRatedCards(setName,uid): FirebaseObjectObservable<any>{
    var userDetails = this.authService.getUserDetails();
    var userToSearchFor = uid !== null ? uid : userDetails.uid;
    
    var firebaseObject = this.db.object(this.basePath +"/" + userToSearchFor + "/" + setName);

    return firebaseObject;
  }

  getAllRatedCardsForAverageUser(setName): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.getAllUsersWhoHaveRatedSet(setName).subscribe(results=>{
        let userPromiseArray: FirebaseObjectObservable<any>[] = [];
        for(let user of results){
          const userKey$ = this.getAllRatedCards(setName,user.$key);
          userPromiseArray.push(userKey$);
        }

        if(userPromiseArray.length==0){
          resolve({});
        }
        else{
          Observable
            .zip(...userPromiseArray)
            .subscribe(users => {
              var userRatingDict = {};
              for(var i = 0;i<users.length;i++){
                var userCardRatings = users[i];
                for(var cardName in userCardRatings){
                    var card = userCardRatings[cardName];
                    if(userRatingDict[cardName] && !isNaN(card.userRating)){
                      userRatingDict[cardName].numRatings = userRatingDict[cardName].numRatings +1;
                      userRatingDict[cardName].sumOfRatings = parseFloat(userRatingDict[cardName].sumOfRatings + card.userRating);
                    }
                    else if(!isNaN(card.userRating)){
                      userRatingDict[cardName] = {};
                      userRatingDict[cardName].numRatings = 1;
                      userRatingDict[cardName].sumOfRatings = parseFloat(card.userRating);
                    }
                }
              }
              for(var key in userRatingDict){
                userRatingDict[key].userRating = parseFloat((userRatingDict[key].sumOfRatings / userRatingDict[key].numRatings).toFixed(2));
              }
              resolve(userRatingDict);
          });
        }
  
        
      });
    });
  }

  getAllUsersWhoHaveRatedSet(setName): FirebaseListObservable<any>{
    var firebaseList = this.db.list(this.setEditorsPath +"/" + setName);

    this.items = firebaseList.subscribe(results =>{
      return results;
    }) 
    return firebaseList;
  }
}