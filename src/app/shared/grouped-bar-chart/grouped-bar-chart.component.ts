import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as Magic from "mtgsdk-ts";

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GroupedBarChartComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private groupedChartInfo: any;
  private margin: any = { top: 20, bottom: 35, left: 40, right: 20};
  private chart: any;
  private width: number;
  private height: number;
  private x0: any;
  private x1: any;
  private y: any;
  private z: any;
  private xAxis: any;
  private yAxis: any;
  private testData: Array<any>;
  private initialized:boolean;
  private colorsDict:any;

  constructor() { }

  ngOnInit() {
    this.createChart();
    this.updateChart();
  }

  ngOnChanges() {
    if (this.initialized && this.groupedChartInfo.data) {
      this.updateChart();
    }
  }

  createChart() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    // create scales
    this.x0 = d3.scaleBand().rangeRound(([0, this.width])).paddingInner(.1);
    this.x1 = d3.scaleBand().padding(0.05);
    this.y = d3.scaleLinear().rangeRound(([this.height,0]));

    //create colors dict to map with colors coming in
    this.colorsDict ={"W":"#d6d6d6","U":"#1e6ca7","B":"#000000","R":"#f40234","G":"#3db161"}

    this.initialized = true;
  }

  updateChart() {
    this.testData = this.groupedChartInfo.data;
    var keys = this.groupedChartInfo.chartKeys;

    var colorsArray = [];
    //associate scale with colors
    for (var keyId in keys){
      colorsArray.push(this.colorsDict[keys[keyId]])
    }

    // update scales & axis
    this.x0.domain(this.testData.map(function(d){return d.Grouping}));
    this.x1.domain(keys).rangeRound([0,this.x0.bandwidth()]);
    this.y.domain([0, d3.max(this.testData, function(d){return d3.max(keys as Array<string>, function(key){return d[key];})})]);
    this.z = d3.scaleOrdinal().range(colorsArray);

    const element = this.chartContainer.nativeElement;

    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);
      

    // chart plot area
    this.chart = svg.append('g')
    .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    
      var that = this;
    this.chart.append("g")
    .selectAll("g")
    .data(that.testData)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + that.x0(d.Grouping) + ",0)"; })    
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
    .attr('x', d => that.x1(d.key))
      .attr('y', d => that.y(d.value))
      .attr('width', d => that.x1.bandwidth())
      .attr('height', d => that.height - that.y(d.value))
      .style('fill', (d, i) => that.z(d.key));

    this.chart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + that.height + ")")
      .call(d3.axisBottom(that.x0));

    this.chart.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(that.y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", that.y(that.y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")

  var legend = this.chart.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", that.width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", that.z);

  legend.append("text")
      .attr("x", that.width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
  
  }

  

}
