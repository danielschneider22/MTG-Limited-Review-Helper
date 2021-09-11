import { Component, ChangeDetectorRef,AfterViewInit,ViewChild,OnInit } from '@angular/core';
import { GetMtgCardsService } from '../Services/get-mtg-cards.service';
import { RatingsService } from '../Services/ratings.service';
import { CardFilterComponent } from '../card-filter/card-filter.component';
import { AuthService } from '../Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';


@Component({
  selector: 'app-compare-set-reviews',
  templateUrl: './compare-set-reviews.component.html',
  styleUrls: ['./compare-set-reviews.component.css'],
  providers: [GetMtgCardsService,RatingsService]
})
export class CompareSetReviewsComponent implements AfterViewInit{

  //card filter component to be used in this component
  @ViewChild(CardFilterComponent) cardFilter;

  constructor(private chRef: ChangeDetectorRef,private mtgCardService: GetMtgCardsService,private ratingsService: RatingsService,private toastr: ToastrService,private authService: AuthService){};

  usersWhoHaveReviewedSelectedSet = []
  user1 = null
  user2 = null
  usersLoaded = false;
  showRatingTable = false;
  averageDifference = 0;
  user1Ratings = [];
  user2Ratings = [];
  sortingText = "Asc";

  message = "message from parent"

  expandImages = false;
  mobile = false;

  ngOnInit(){
    if (window.screen.width <500) { // 768px portrait
      this.mobile = true;
      this.expandImages = false;
    }
  }

  ngAfterViewInit(){
    this.cardFilter.hiddenFeaturesObject.hideRatingsOptions = true;
  }  

  //called when data is changed
  dataChangeEvent($event){
    this.changeDisplayCardsToIntersectionOfUsers();
  }

  differenceRatingTextForm(difference){
    var absDifference = Math.abs(difference)
    if(absDifference==0)
      return "Match!"
    else if(absDifference>0 && absDifference<=0.5)
      return "Minor Difference"
    else if(absDifference>.5 && absDifference<=1.0)
      return "Medium Difference"
    else if(absDifference>1.0 && absDifference<=1.5)
      return "Major Difference"
    else if(absDifference>1.5)
      return "Extreme Difference"
  }

  differenceRatingClasses(difference){
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


  getAllUsersWhoHaveRatedSelectedSet(){
    this.usersLoaded = false;
    this.ratingsService.getAllUsersWhoHaveRatedSet(this.cardFilter.selectedSet.name).subscribe(results=>{
      this.usersWhoHaveReviewedSelectedSet = results;
      for(let user of results){
        if(user.$key == this.authService.getUserDetails().uid)
          this.user1 = user
        if(user.$key == 'TKgfYUywxRbVcYvj62Eb1cUb8B83')
          this.user2 = user;
      }
      this.usersWhoHaveReviewedSelectedSet.push({"displayName":"Average User","hidden":false,"reviewed":true,"$key":"Average User"});
      this.onUserSelectedChanged();
      this.usersLoaded = true;
    })
  }

  sortByDifference(){
    var that = this;
    if(this.sortingText == "Asc"){
      this.cardFilter.groupingStatistics1 = "";
        //sort by the grouping statistic and then sort by color
        this.cardFilter.displayCards = this.cardFilter.displayCards.sort(function(a, b){
          if((a.colors && b.colors) && a.colors[0] == b.colors[0] && (Math.abs(b.user1Rating-b.user2Rating) - Math.abs(a.user1Rating-a.user2Rating) ==0)){
            return 0;
          }
          else if((a.colors && b.colors) && a.colors[0] != b.colors[0] && (Math.abs(b.user1Rating-b.user2Rating) - Math.abs(a.user1Rating-a.user2Rating) ==0)){
            return a.colors[0].localeCompare(b.colors[0]);
          }
          else{
            return Math.abs(b.user1Rating-b.user2Rating) - Math.abs(a.user1Rating-a.user2Rating);
          }
        });
        this.sortingText="Desc";
    }
    else if(this.sortingText == "Desc"){
      this.cardFilter.displayCards = this.cardFilter.displayCards.sort(function(a, b){
        if((a.colors && b.colors) && a.colors[0] == b.colors[0] && (Math.abs(a.user1Rating-a.user2Rating) - Math.abs(b.user1Rating-b.user2Rating) ==0)){
          return 0;
        }
        else if((a.colors && b.colors) && a.colors[0] != b.colors[0] && (Math.abs(a.user1Rating-a.user2Rating) - Math.abs(b.user1Rating-b.user2Rating) ==0)){
          return a.colors[0].localeCompare(b.colors[0]);
        }
        else{
          return Math.abs(a.user1Rating-a.user2Rating) - Math.abs(b.user1Rating-b.user2Rating);
        }
      });
      this.sortingText="None";
    }
    else{
      this.cardFilter.filterAllCards();
      this.sortingText="Asc";
    }
  }

  changeDisplayCardsToIntersectionOfUsers(){
    var tempCards = []
    var numCards = 0;
    this.averageDifference = 0;
    for (let card of this.cardFilter.displayCards){
      card.name = card.name.replace(new RegExp("/", 'g'), '-');
      if(this.user1Ratings[card.name] && this.user2Ratings[card.name]){
        card.user1Rating = this.user1Ratings[card.name].userRating;
        card.user2Rating = this.user2Ratings[card.name].userRating;
        card.user1comments = this.user1Ratings[card.name].comments;
        card.user2comments = this.user2Ratings[card.name].comments;
        this.averageDifference = this.averageDifference + Math.abs(card.user1Rating - card.user2Rating);
        tempCards.push(card)
        numCards++;
      }
    }
    this.cardFilter.displayCards = tempCards;
    this.averageDifference = this.averageDifference / numCards;
    this.sortingText = "Asc"
    this.sortByDifference()
  }

  onUserSelectedChanged(){
    this.showRatingTable = false;
    if(this.user1 && this.user2){
      var user1GetCards = null;
      var user2GetCards = null;
      if(this.user1.displayName=="Average User"){
        user1GetCards = this.ratingsService.getAllRatedCardsForAverageUser(this.cardFilter.selectedSet.name);
      }
      else{
        user1GetCards = this.ratingsService.getAllRatedCards(this.cardFilter.selectedSet.name,this.user1.$key);
      }

      if(this.user2.displayName=="Average User"){
        user2GetCards = this.ratingsService.getAllRatedCardsForAverageUser(this.cardFilter.selectedSet.name);
      }
      else{
        user2GetCards = this.ratingsService.getAllRatedCards(this.cardFilter.selectedSet.name,this.user2.$key);
      }

      Observable
        .zip(user1GetCards, user2GetCards)
        .subscribe(pair => {
          this.user1Ratings = pair[0];
          this.user2Ratings = pair[1];
          this.cardFilter.filterAllCards();
          setTimeout(()=>{
            this.showRatingTable = true;
          }, 100);
       })

    }
  }


  //called when a set is chosen and fully loaded
  setLoadedEvent($event){
    this.getAllUsersWhoHaveRatedSelectedSet()
  }

}
