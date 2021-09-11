import {
  Component,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild
} from "@angular/core";

import { GetMtgCardsService } from "../Services/get-mtg-cards.service";
import { RatingsService } from "../Services/ratings.service";
import { CardFilterComponent } from "../card-filter/card-filter.component";

import { ToastrService } from "ngx-toastr";
import { JsonToCSVService } from "./../Services/json-to-csv.service.spec";

@Component({
  selector: "app-your-limited-set-reviews",
  templateUrl: "./your-limited-set-reviews.component.html",
  styleUrls: ["./your-limited-set-reviews.component.css"],
  providers: [GetMtgCardsService, RatingsService, JsonToCSVService]
})
export class YourLimitedSetReviewsComponent implements AfterViewInit {
  @ViewChild(CardFilterComponent) cardFilter;

  constructor(
    private chRef: ChangeDetectorRef,
    private mtgCardService: GetMtgCardsService,
    private ratingsService: RatingsService,
    private toastr: ToastrService,
    private csvConverter: JsonToCSVService
  ) {}

  numberOfReviewedCards = 0;
  numberOfNonLandCardsInSet = 0;
  gotUserRatingsForSet = false;
  progressObservable = null;
  saveSuccess = false;
  userData = {};
  progress = 0;
  expandImages = true;
  mobile = false;
  hasChangedAReview = false;

  ngOnInit() {
    if (window.screen.width < 500) {
      // 768px portrait
      this.mobile = true;
    }
  }

  ngAfterViewInit() {}

  //called when data is changed
  dataChangeEvent($event) {}

  exportToCSV() {
    const exportedJson = [];
    for (var cardId in this.cardFilter.displayCards) {
      var card = this.cardFilter.displayCards[cardId];
      if (card.userRating !== null && card.userRating !== undefined) {
        exportedJson.push({
          cardName: card.name,
          cardType: card.type_line.replace("—", "-"),
          colorIdentity: card.color_identity
            ? card.color_identity.join(",")
            : "",
          cardManaCost: card.mana_cost,
          cardRarity: card.rarity,
          userRating: card.userRating
        });
        card.hasChanged = false;
      }
    }

    this.csvConverter.exportJsonAsCSVFile(
      exportedJson,
      this.cardFilter.selectedSet.name + ".csv"
    );
  }

  getAllUserRatingsForASet() {
    var that = this;
    this.gotUserRatingsForSet = false;
    this.ratingsService
      .getAllRatedCards(this.cardFilter.selectedSet.name, null)
      .subscribe(results => {
        that.userData = results;
        that.incorporateUserRatingsIntoCardDataSet();
        that.gotUserRatingsForSet = true;
      });
  }

  getAverageRating() {
    let averageRating = 0;
    let filteredReviewedCards = 0;
    for (let card of this.cardFilter.displayCards) {
      if (card.userRating !== null && card.userRating !== undefined) {
        averageRating = averageRating + card.userRating;
        filteredReviewedCards++;
      }
    }
    return filteredReviewedCards ? averageRating / filteredReviewedCards : 0;
  }

  incorporateUserRatingsIntoCardDataSet() {
    this.numberOfReviewedCards = 0;
    this.numberOfNonLandCardsInSet = 0;
    for (let card of this.cardFilter.allCardsOfSet) {
      card.name = card.name.replace(new RegExp("/", "g"), "-");
      if (
        this.userData[card.name] !== null &&
        this.userData[card.name] !== undefined
      ) {
        card.userRating = this.userData[card.name].userRating;
        card.comments = this.userData[card.name].comments;
        this.numberOfReviewedCards = this.numberOfReviewedCards + 1;
      }
      if (card.type_line.indexOf("Land") == -1) {
        this.numberOfNonLandCardsInSet = this.numberOfNonLandCardsInSet + 1;
      }
    }
  }

  setLoadedEvent(message) {
    this.getAllUserRatingsForASet();
  }

  resetRatingsVariables() {
    this.numberOfReviewedCards = 0;
    this.numberOfNonLandCardsInSet = 0;
  }

  rateCard(card, rating) {
    card.hasChanged = true;
    card.userRating = rating;
    this.hasChangedAReview = true;
  }

  saveAllRatings() {
    var ratedCardArray = [];
    for (var cardId in this.cardFilter.displayCards) {
      var card = this.cardFilter.displayCards[cardId];
      if (
        card.userRating !== null &&
        card.userRating !== undefined &&
        card.hasChanged == true
      ) {
        ratedCardArray.push({
          name: card.name,
          userRating: card.userRating,
          comments: card.comments ? card.comments : ""
        });
        card.hasChanged = false;
      }
    }
    this.ratingsService.saveAllRatedCards(
      ratedCardArray,
      this.cardFilter.selectedSet.name
    );
    this.toastr.clear();
    this.toastr.success(
      (
        (this.numberOfReviewedCards / this.numberOfNonLandCardsInSet) *
        100
      ).toFixed(2) + "% of Set Reviewed",
      "All Ratings Saved",
      {
        timeOut: 3000,
        positionClass: "toast-top-center"
      }
    );
    this.hasChangedAReview = false;
  }

  expandOrContract(card) {
    this.expandImages = !this.expandImages;
  }

  setHasChangedAReview() {
    for (var cardId in this.cardFilter.displayCards) {
      var card = this.cardFilter.displayCards[cardId];
      this.hasChangedAReview = false;
      if (card.hasChanged == true) {
        this.hasChangedAReview = true;
        break;
      }
    }
  }

  saveRating(card) {
    this.ratingsService.addRatedCard(
      {
        name: card.name,
        userRating: card.userRating,
        comments: card.comments ? card.comments : ""
      },
      this.cardFilter.selectedSet.name
    );
    this.toastr.clear();
    this.toastr.success(
      (
        (this.numberOfReviewedCards / this.numberOfNonLandCardsInSet) *
        100
      ).toFixed(2) + "% of Set Reviewed",
      card.name + " Saved",
      {
        timeOut: 2000,
        positionClass: "toast-top-center"
      }
    );
    card.hasChanged = false;
    this.setHasChangedAReview();
  }

  getProgressBarWidth() {
    return (
      (this.numberOfReviewedCards / this.numberOfNonLandCardsInSet) * 100 + "%"
    );
  }

  getProgressBarTextWidth() {
    return (this.numberOfReviewedCards / this.numberOfNonLandCardsInSet) * 100 >
      25
      ? "100%"
      : "100px";
  }
}
