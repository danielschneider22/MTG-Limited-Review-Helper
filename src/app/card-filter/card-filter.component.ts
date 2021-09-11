import {
  Component,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  Input
} from "@angular/core";
import * as Magic from "mtgsdk-ts";
import { GetMtgCardsService } from "../Services/get-mtg-cards.service";
import { ToastrService } from "ngx-toastr";
import { truncateSync } from "fs";

@Component({
  selector: "app-card-filter",
  templateUrl: "./card-filter.component.html",
  styleUrls: ["./card-filter.component.css"]
})
export class CardFilterComponent implements OnInit {
  @Output() dataChangeEvent = new EventEmitter<string>();
  @Output() setLoadedEvent = new EventEmitter<string>();
  @Output() setLoadingStartedEvent = new EventEmitter<string>();

  private groupedChartInfo: any = [];

  allCardsOfSet: Magic.Card[] = [];
  displayCards: Magic.Card[] = [];
  allSets: Magic.Set[] = [];
  selectedSet: Magic.Set = null;

  selectedColors = [];
  selectedCardType = "";
  selectedCardRarity = "";
  groupingStatistics1 = "";

  loadedCardSet = false;
  showOnlyUnrated = false;
  colorsAreInclusive = false;
  ratingMin = null;
  ratingMax = null;
  cardNameSearchPhrase = "";

  mobile = false;

  hiddenFeaturesObject = {};

  constructor(
    private chRef: ChangeDetectorRef,
    private mtgCardService: GetMtgCardsService,
    private toastr: ToastrService
  ) {}

  //on init, get all of the mtg sets for dropdown
  ngOnInit() {
    var that = this;
    this.mtgCardService.getAllSets().subscribe(retrievedSets => {
      that.allSets = this.mtgCardService.sortAllSetsByReleaseDate(
        retrievedSets
      );
    });

    if (window.screen.width < 500) {
      // 768px portrait
      this.mobile = true;
    }
  }

  //when dropdown is changed, load the card data for that set
  onSetFilterChange() {
    var that = this;
    this.setLoadingStartedEvent.emit("Set Loading");
    this.allCardsOfSet = [];
    this.displayCards = [];
    this.loadedCardSet = false;
    this.toastr.info("", "Loading " + this.selectedSet.name + " Cards", {
      timeOut: 10000,
      progressBar: true,
      positionClass: "toast-top-center"
    });
    if (this.selectedSet) {
      this.mtgCardService
        .getCardsFromSet(this.selectedSet.code)
        .subscribe(retrievedCards => {
          setTimeout(() => {
            that.allCardsOfSet = [];
            for (var cardId in retrievedCards) {
              var card = retrievedCards[cardId];
              if (
                !this.selectedSet.last_booster_collector_no ||
                parseInt(card.collector_number) <=
                  this.selectedSet.last_booster_collector_no
              ) {
                that.allCardsOfSet.push(card);
              }
            }
            that.onFilterChange();
            that.toastr.clear();
            that.toastr.success("", "Cards Loaded", {
              timeOut: 1000,
              positionClass: "toast-top-center"
            });
            that.setLoadedEvent.emit("Set loaded.");
            that.loadedCardSet = true;
          }, 100);
        });
    }
  }

  cardColorsIncludesSelectedColors(card) {
    let isValid = false;
    for (var color in this.selectedColors) {
      if (card.colors.includes(this.selectedColors[color])) {
        isValid = true;
      }
    }
    if (!this.colorsAreInclusive) {
      for (var color in card.colors) {
        if (!this.selectedColors.includes(card.colors[color])) {
          isValid = false;
        }
      }
    }

    return isValid;
  }

  //filter all the cards based on the drop-downs selected
  filterAllCards() {
    var that = this;

    var tempCards = [];
    tempCards = this.allCardsOfSet.filter(
      card =>
        (!that.selectedCardType ||
          card.type_line.indexOf(that.selectedCardType) != -1) &&
        (!that.selectedCardRarity ||
          card.rarity.toLowerCase() == that.selectedCardRarity.toLowerCase()) &&
        (that.selectedColors.length == 0 ||
          (that.selectedColors &&
            card.colors &&
            that.cardColorsIncludesSelectedColors(card))) &&
        (!that.showOnlyUnrated ||
          (that.showOnlyUnrated &&
            (card.userRating === null || card.userRating === undefined))) &&
        (that.showOnlyUnrated ||
          !that.ratingMin ||
          that.ratingMin <= card.userRating) &&
        (that.showOnlyUnrated ||
          !that.ratingMax ||
          that.ratingMax >= card.userRating) &&
        (!that.cardNameSearchPhrase ||
          card.name
            .toLowerCase()
            .indexOf(that.cardNameSearchPhrase.toLowerCase()) != -1)
    );
    if (this.groupingStatistics1) {
      //sort by the grouping statistic and then sort by color
      this.displayCards = tempCards.sort(function(a, b) {
        if (
          a.colors &&
          b.colors &&
          a.colors[0] == b.colors[0] &&
          a[that.groupingStatistics1] - b[that.groupingStatistics1] == 0
        ) {
          return 0;
        } else if (
          a.colors &&
          b.colors &&
          a.colors[0] != b.colors[0] &&
          a[that.groupingStatistics1] - b[that.groupingStatistics1] == 0
        ) {
          return a.colors[0].localeCompare(b.colors[0]);
        } else {
          return a[that.groupingStatistics1] - b[that.groupingStatistics1];
        }
      });
    } else {
      this.displayCards = tempCards.sort(function(a, b) {
        if (a.colors && b.colors) return a.colors[0].localeCompare(b.colors[0]);
        else if (!a.colors) return -1;
        else return 1;
      });
    }
    that.chRef.detectChanges();
    this.notifyParentDisplayCardsHaveChanged("Display Data has been updated.");
  }

  //when a color is clicked
  //if it was previously clicked, de-select it. otherwise add it to selected colors
  colorClicked(color) {
    var index = this.selectedColors.indexOf(color);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
    this.onFilterChange();
  }

  //let parent know that the display data has changed
  notifyParentDisplayCardsHaveChanged(message) {
    this.dataChangeEvent.emit(message);
  }

  //when dropdown is changed, filter the data for displayed cards
  onFilterChange() {
    var that = this;

    if (
      this.groupingStatistics1 == "power" ||
      this.groupingStatistics1 == "toughness"
    ) {
      setTimeout(() => {
        that.selectedCardType = "Creature";
        that.chRef.detectChanges();
        this.filterAllCards();
      }, 100);
    } else {
      this.filterAllCards();
    }
  }
}
