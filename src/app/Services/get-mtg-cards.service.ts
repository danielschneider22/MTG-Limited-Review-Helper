import { Injectable } from '@angular/core';
import * as Magic from "mtgsdk-ts";
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable } from 'angularfire2/database-deprecated'; 


@Injectable()
export class GetMtgCardsService {
  
  constructor(private db: AngularFireDatabase,private toastr: ToastrService) { }

  getCardsFromSet(setCode:string): FirebaseListObservable<any>{
    var firebaseList = this.db.list("/cardData/" + setCode);

    var items = firebaseList.subscribe(results =>{
      return results;
    }) 
    return firebaseList;
  }

  getCardsFromSet_OLD_API(setCode:string): Promise<Magic.Card[]>{
    return new Promise<Magic.Card[]>((resolve, reject) => {
      var mtgCardFromASetFromCache = this.getCardsFromSetFromCache(setCode);
      if(mtgCardFromASetFromCache != null){
        setTimeout(()=>{
          resolve(mtgCardFromASetFromCache);
        }, 100);
      }
      else{
        let allCards: Magic.Card[] = [];
        try{
          Magic.Cards.all({set: setCode, pageSize: 20}).on("data", card => {
            allCards.push(card);
          }).on("end", () => {
            try {
                sessionStorage.setItem(setCode,JSON.stringify(allCards));
            } catch (e) {
                sessionStorage.clear();
                sessionStorage.setItem(setCode,JSON.stringify(allCards));
            }
            resolve(allCards);
          });
        }
        catch(e){
          this.toastr.error("Error loading set: " + e);
        }
        
      }
    });
  }

  getCardsFromSetFromCache(setCode){
    return <Array<Magic.Card>>JSON.parse(sessionStorage.getItem(setCode));
  }

  getAllSets(): FirebaseListObservable<any>{
    var firebaseList = this.db.list("/setData/");

    var items = firebaseList.subscribe(results =>{
      return results;
    }) 
    return firebaseList;
  }

  getAllSets_OLD_API(): Promise<Magic.Set[]>{
    return new Promise<Magic.Set[]>((resolve, reject) => {
      var mtgSetsFromCache = this.getSetsFromCache();
      if(mtgSetsFromCache != null){
        resolve(mtgSetsFromCache)
      }
      else{
        let allSets: Magic.Set[] = [];
        Magic.Sets.all({pageSize: 30}).on("data", set => {
          if(set.type=="expansion" || set.type=="reprint" || set.type=="core")
            allSets.push(set);
        }).on("end", () => {
          this.sortAllSetsByReleaseDate_OLD_API(allSets);
          try {
            sessionStorage.setItem("mtgSets",JSON.stringify(allSets));
          } catch (e) {
              if (e.name === 'QuotaExceededError') {
                  sessionStorage.clear();
                  sessionStorage.setItem("mtgSets",JSON.stringify(allSets));
              }
          }
          resolve(allSets);
        });
      }
    });
  }

  getSetsFromCache(){
    return <Array<Magic.Set>>JSON.parse(sessionStorage.getItem("mtgSets"));
  }

  sortAllSetsByReleaseDate(allSets){
    allSets.sort( function(set1, set2) {
      if ( set1.released_at < set2.released_at ){
        return 1;
      }else if( set1.released_at > set2.released_at ){
          return -1;
      }else{
        return 0;	
      }
    });
    return allSets;
  }

  sortAllSetsByReleaseDate_OLD_API(allSets){
    allSets.sort( function(set1, set2) {
      if ( set1.releaseDate < set2.releaseDate ){
        return 1;
      }else if( set1.releaseDate > set2.releaseDate ){
          return -1;
      }else{
        return 0;	
      }
    });
  }

}
