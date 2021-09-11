import { Component, ChangeDetectorRef,AfterViewInit,ViewChild } from '@angular/core';

import { GetMtgCardsService } from '../Services/get-mtg-cards.service';
import { CardFilterComponent } from '../card-filter/card-filter.component';

@Component({
  selector: 'app-set-statistics-tab',
  templateUrl: './set-statistics-tab.component.html',
  styleUrls: ['./set-statistics-tab.component.css'],
  providers: [GetMtgCardsService]
})
export class SetStatisticsTabComponent implements AfterViewInit {

  //card filter component to be used in this component
  @ViewChild(CardFilterComponent) cardFilter;
  
  private groupedChartInfo: any = [];
  finishedSettingUpBarChartInfo = false;
  mobile = false;

  constructor(private chRef: ChangeDetectorRef,private mtgCardService: GetMtgCardsService){};

  ngOnInit(){
    if (window.screen.width <500) { // 768px portrait
      this.mobile = true;
    }
  }

  ngAfterViewInit(){
    this.cardFilter.hiddenFeaturesObject.hideRatingsOptions = true;
  }   

  //when a dropdown is changed, load the card data for that set
  updateChart(message){
    var that = this;
    if(this.cardFilter.selectedSet && this.cardFilter.selectedColors.length>0 && this.cardFilter.groupingStatistics1){
        that.setUpBarChart();
    }
    else{
      this.finishedSettingUpBarChartInfo=false;
    }
  }
  
  //put data into chart format for bar chart to be generated
  setUpBarChart() {
    var that = this;

    this.groupedChartInfo = {};
    this.finishedSettingUpBarChartInfo=false;

    //timeout used to re-draw the bar chart
    setTimeout(()=>{
      this.groupedChartInfo.data = [];
      var tempArray = this.cardFilter.displayCards;
      var tempDict = {};

      //all of this is to set-up card data in a way d3 can understand
      for (let myCard of tempArray) {
        if (tempDict[myCard[this.cardFilter.groupingStatistics1]]==null){
          tempDict[myCard[this.cardFilter.groupingStatistics1]] = {};
          tempDict[myCard[this.cardFilter.groupingStatistics1]][myCard.colors[0]] = 1;
        }
        else if(tempDict[myCard[this.cardFilter.groupingStatistics1]][myCard.colors[0]]==null){
          tempDict[myCard[this.cardFilter.groupingStatistics1]][myCard.colors[0]] = 1;
        }
        else{
          tempDict[myCard[this.cardFilter.groupingStatistics1]][myCard.colors[0]] = tempDict[myCard[this.cardFilter.groupingStatistics1]][myCard.colors[0]] + 1;
        }
      }
      
      var keysDict = {};
      for (let key of Object.keys(tempDict)) {
        var groupedChartDataObject = {"Grouping":this.cardFilter.groupingStatistics1 + ":" + key};
        for (let key2 of Object.keys(tempDict[key])) {
          groupedChartDataObject[key2] = tempDict[key][key2];
          keysDict[key2] = true;
        }
        var mycolorarray = ["White","Blue"];
        for(var colorId in mycolorarray){
          if(!groupedChartDataObject[mycolorarray[colorId]]){
            groupedChartDataObject[mycolorarray[colorId]] = 0;
          }
        }
        this.groupedChartInfo.data.push(groupedChartDataObject);
        
      }
      
      this.groupedChartInfo.chartKeys =Object.keys(keysDict);
      this.finishedSettingUpBarChartInfo = true;
    }, 100);
  }

}
