import { Component, OnInit,ViewChild } from '@angular/core';
import { GetMtgCardsService } from '../Services/get-mtg-cards.service';
import { CardReviewGameService } from '../Services/card-review-game.service';
import { CardReviewGameSetupComponent } from '../card-review-game-setup/card-review-game-setup.component';
import { RatingsService } from '../Services/ratings.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-card-review-game',
  templateUrl: './card-review-game.component.html',
  styleUrls: ['./card-review-game.component.css'],
  providers: [GetMtgCardsService,CardReviewGameService,RatingsService]
})
export class CardReviewGameComponent implements OnInit {

  constructor(public cardReviewGameService:CardReviewGameService,private ratingsService: RatingsService,private toastr: ToastrService,public authService: AuthService) { }

   //card filter component to be used in this component
   @ViewChild(CardReviewGameSetupComponent) cardReviewGameSetup;

  title = "Card Review Game";
  currentGameCard : any;
  playingGame = false;
  numberOfReviewedCards = 0;
  numberOfNonLandCardsInSet = 0;
  unratedCardList = [];
  ratedCardList = [];
  ratedFromGameCards = [];
  ratedFromGameCardIndex = 0;
  unratedCardListIndex = 0;
  lsvDifferenceSum = 0;
  lsvNumComparisons = 0;
  avgUserDifferenceSum = 0;
  avgUserNumComparisons = 0;

  ngOnInit() {
  }

  getRandomArrayIndex(array){
    var randomArrayElement =  Math.floor(Math.random() * array.length);
    return randomArrayElement;
  }

  setCurrentGameCardToRandomCard(){
    if(this.unratedCardList.length>0){
      var randomArrayIndex = this.getRandomArrayIndex(this.unratedCardList);
      this.unratedCardListIndex = randomArrayIndex;
      this.currentGameCard = this.unratedCardList[randomArrayIndex];
    }
    else{
      var randomArrayIndex = this.getRandomArrayIndex(this.ratedCardList);
      this.currentGameCard = this.ratedCardList[randomArrayIndex];
    }
  }

  initializeGame(){
    this.ratedFromGameCards = [];
    this.ratedCardList = [];
    this.unratedCardList = [];
    this.numberOfReviewedCards = 0;
    this.numberOfNonLandCardsInSet = 0;
    this.lsvDifferenceSum = 0;
    this.lsvNumComparisons = 0;
    this.avgUserDifferenceSum = 0;
    this.avgUserNumComparisons = 0;

    for (let card of this.cardReviewGameSetup.cardsForSet){
      card.name = card.name.replace(new RegExp("/", 'g'), '-');
      if(card.type_line.indexOf('Land')==-1 && (!this.cardReviewGameSetup.last_booster_collector_no || parseInt(card.collector_number)<=this.cardReviewGameSetup.last_booster_collector_no)){
        if(this.cardReviewGameSetup.userRatingsForSet[card.name] !== null && this.cardReviewGameSetup.userRatingsForSet[card.name] !== undefined){
          this.ratedCardList.push(card);
          this.numberOfReviewedCards = this.numberOfReviewedCards + 1
        }
        else{
          this.unratedCardList.push(card);
        }
        this.numberOfNonLandCardsInSet = this.numberOfNonLandCardsInSet + 1;
      }
    }
    this.playingGame = true;
    this.setCurrentGameCardToRandomCard();
    this.ratedFromGameCards.push(this.currentGameCard);
    this.ratedFromGameCardIndex = 0;
  }

  saveRating(){
    if(this.authService.isLoggedInBoolean())
      this.ratingsService.addRatedCard({"name":this.currentGameCard.name,"userRating":this.currentGameCard.userRating,"comments":""},this.cardReviewGameSetup.selectedSetForGame.name);
    if(this.unratedCardList.length>0){
      this.ratedCardList.push(this.currentGameCard);
      this.unratedCardList.splice(this.unratedCardListIndex,1);
      this.numberOfReviewedCards = this.numberOfReviewedCards + 1;
    }
    this.currentGameCard.hasChanged = false;
    this.currentGameCard.hasBeenSaved = true;
    if(this.lsvRatingExistsAndCardHasBeenSaved()){
      this.currentGameCard.differenceFromLSV = this.cardReviewGameSetup.lsvRatingsForSet[this.currentGameCard.name].userRating - this.currentGameCard.userRating;
      this.lsvDifferenceSum = this.lsvDifferenceSum + Math.abs(this.currentGameCard.differenceFromLSV);
      this.lsvNumComparisons = this.lsvNumComparisons + 1;
    }
    if(this.avgUserRatingExistsAndCardHasBeenSaved()){
      this.currentGameCard.differenceFromAvgUser = this.cardReviewGameSetup.averageUserRatingsForSet[this.currentGameCard.name].userRating - this.currentGameCard.userRating;
      this.avgUserDifferenceSum = this.avgUserDifferenceSum + Math.abs(this.currentGameCard.differenceFromAvgUser);
      this.avgUserNumComparisons = this.avgUserNumComparisons + 1;
    }
  }

  lsvRatingExistsAndCardHasBeenSaved(){
    return this.currentGameCard.hasBeenSaved && this.cardReviewGameSetup.lsvRatingsForSet[this.currentGameCard.name];
  }

  avgUserRatingExistsAndCardHasBeenSaved(){
    return this.currentGameCard.hasBeenSaved && this.cardReviewGameSetup.averageUserRatingsForSet[this.currentGameCard.name];
  }

  getRating(user){
    if(user == "LSV" && this.lsvRatingExistsAndCardHasBeenSaved())
      return this.cardReviewGameSetup.lsvRatingsForSet[this.currentGameCard.name].userRating;
    else if(user == "AVG" && this.avgUserRatingExistsAndCardHasBeenSaved())
      return this.cardReviewGameSetup.averageUserRatingsForSet[this.currentGameCard.name].userRating;
    else
      return '-';
  }

  getDifference(user){
    if(user == "LSV" && this.lsvRatingExistsAndCardHasBeenSaved())
      return this.currentGameCard.differenceFromLSV;
    else if(user == "AVG" && this.avgUserRatingExistsAndCardHasBeenSaved())
      return this.currentGameCard.differenceFromAvgUser.toFixed(2);
    else
      return '-';
  }

  getDifferenceLevel(user){
    if(user == "LSV" && this.lsvRatingExistsAndCardHasBeenSaved())
      return this.differenceRatingTextForm(this.currentGameCard.differenceFromLSV);
    if(user == "AVG" && this.avgUserRatingExistsAndCardHasBeenSaved())
      return this.differenceRatingTextForm(this.currentGameCard.differenceFromAvgUser);
    else
      return '-';
  }

  getAverageRatingDifference(user){
    if(user == "LSV" && this.lsvNumComparisons == 0 || user == "AVG" && this.avgUserNumComparisons == 0 ){
      return '-';
    }
    else if(user == "LSV"){
      return (this.lsvDifferenceSum/this.lsvNumComparisons).toFixed(2) + "" ;
    }
    else if(user == "AVG"){
      return (this.avgUserDifferenceSum/this.avgUserNumComparisons).toFixed(2) + "";
    }
      
  }

  differenceRatingClasses(difference,user){
    if(user == null || user == "LSV" && this.lsvRatingExistsAndCardHasBeenSaved() || user == "AVG" && this.avgUserRatingExistsAndCardHasBeenSaved()){
      var absDifference = Math.abs(difference)
      if(absDifference==0)
        return "matchStyle"
      else if(absDifference>0 && absDifference<=0.5)
        return "minorDiffStyle"
      else if(absDifference>.5 && absDifference<=1.0)
        return "mediumDiffStyle"
      else if(absDifference>1.0 && absDifference<=1.5)
        return "majorDiffStyle"
      else if(absDifference>1.5)
        return "extremeDiffStyle"
    }
    else{
      return "";
    }

  }

  differenceRatingTextForm(difference){
    var absDifference = Math.abs(difference)
    if(absDifference==0)
      return "Match!"
    else if(absDifference>0 && absDifference<=0.5)
      return "Minor"
    else if(absDifference>.5 && absDifference<=1.0)
      return "Medium"
    else if(absDifference>1.0 && absDifference<=1.5)
      return "Major"
    else if(absDifference>1.5)
      return "Extreme"
  }

  nextButtonClicked(){
    if(this.ratedFromGameCardIndex==this.ratedFromGameCards.length-1){
      this.setCurrentGameCardToRandomCard();
      this.ratedFromGameCards.push(this.currentGameCard);
    }
    else{
      this.currentGameCard = this.ratedFromGameCards[this.ratedFromGameCardIndex + 1];
    }
    this.ratedFromGameCardIndex = this.ratedFromGameCardIndex + 1;
  }

  previousButtonClicked(){
    this.currentGameCard = this.ratedFromGameCards[this.ratedFromGameCardIndex - 1];
    this.ratedFromGameCardIndex = this.ratedFromGameCardIndex - 1;
  }

  returnButtonClicked(){
    this.playingGame = false;
  }

  rateCard(rating){
    if(!this.currentGameCard.hasBeenSaved){
      this.currentGameCard.hasChanged = true;
      this.currentGameCard.userRating = rating;
    }
    
  }

  getProgressBarWidth(){
    return (this.numberOfReviewedCards/this.numberOfNonLandCardsInSet)*100 + '%';
  }

  getProgressBarTextWidth(){
      return (this.numberOfReviewedCards/this.numberOfNonLandCardsInSet)*100 > 25 ? '100%' : '100px';
  }

}
