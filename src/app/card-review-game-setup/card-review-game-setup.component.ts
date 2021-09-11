import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import * as Magic from "mtgsdk-ts";
import { GetMtgCardsService } from '../Services/get-mtg-cards.service';
import { CardReviewGameService } from '../Services/card-review-game.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RatingsService } from '../Services/ratings.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import { AuthService } from '../Services/auth.service';


@Component({
  selector: 'app-card-review-game-setup',
  templateUrl: './card-review-game-setup.component.html',
  styleUrls: ['./card-review-game-setup.component.css'],
  providers: [GetMtgCardsService,CardReviewGameService,RatingsService]
})
export class CardReviewGameSetupComponent implements OnInit {

  allSets: Magic.Set[] = [];
  selectedSet : Magic.Set = null;
  selectedSetForGame : Magic.Set = null;
  lsvRatingsForSet : Magic.Set = null;
  cardsForSet : Magic.Card[];
  averageUserRatingsForSet = [];
  userRatingsForSet = [];
  showOnlyUnratedCards = false;
  playingGame = false;

  mobile = false;

  @Output() gameStartedEvent = new EventEmitter<string>();

  constructor(private mtgCardService: GetMtgCardsService,private toastr: ToastrService,private router: Router,public cardReviewGameService:CardReviewGameService,private ratingsService: RatingsService,public authService: AuthService){};

  ngOnInit() {
    var that = this;
    this.mtgCardService.getAllSets().subscribe(retrievedSets=>{
      that.allSets = this.mtgCardService.sortAllSetsByReleaseDate(retrievedSets);
    });
    if (window.screen.width <500) { // 768px portrait
      this.mobile = true;
    }
  }

  playGame(){
    if(this.selectedSet){
      this.toastr.info('',"Loading " + this.selectedSet.name + " Game", {
        timeOut: 10000,
        progressBar:true,
        positionClass:'toast-top-center'
      });
      var that = this;
      var promise1 = this.mtgCardService.getCardsFromSet(this.selectedSet.code);
      var promise2 = this.ratingsService.getAllRatedCardsForAverageUser(this.selectedSet.name);
      var promise3 = this.authService.isLoggedInBoolean() ? this.ratingsService.getAllRatedCards(this.selectedSet.name,null) : new Promise<any>((resolve, reject) => {resolve({})})
      var promise4 = this.ratingsService.getAllRatedCards(this.selectedSet.name,'TKgfYUywxRbVcYvj62Eb1cUb8B83');

      Observable
        .zip(promise1, promise2, promise3, promise4)
        .subscribe(pair => {
          this.toastr.clear();
          this.selectedSetForGame = JSON.parse(JSON.stringify(this.selectedSet));
          this.cardsForSet = [];
          for(var cardId in pair[0]){
            var card = pair[0][cardId];
            if(!this.selectedSet.last_booster_collector_no || parseInt(card.collector_number)<= this.selectedSet.last_booster_collector_no){
              this.cardsForSet.push(card);
            }
          }
          this.averageUserRatingsForSet = pair[1];
          this.userRatingsForSet = pair[2];
          this.lsvRatingsForSet = pair[3];
          this.gameStartedEvent.emit('Game Starting.');
       });
    }
    else{
      this.toastr.error("Please select a set to begin","", {
        timeOut: 5000,
        positionClass:'toast-top-center'
      });
    }
  }

}
