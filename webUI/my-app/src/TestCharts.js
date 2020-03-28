import React from 'react';
import * as d3 from "d3";
import * as topojson from 'topojson-client';
import topoData from './utils';

const projection = d3.geoEqualEarth()
const path = d3.geoPath(projection)
/*  update = () => {
    setInterval(() =>{
      this.drawChart()
    },1000)
  } */



class TestCharts extends React.Component {

  state = {

  };

  shouldComponentUpdate(){
    d3.select('.myUI').remove();
    this.drawChart();
    return true;
  }

  drawChart = ()=>{
    let outline = ({type: "Sphere"})

    var width  = 960;  
    var height = 580;  
    let color = d3.scaleSequential()
    .domain(d3.extent(this.props.dataArray))
    .interpolator(d3.interpolateReds)
    .unknown("#ccc")
    const svg = d3.select('.theChart').append('svg').attr('class','myUI')
    .style("display", "block")
    .attr("viewBox", [0, 0, width, height]);

    const defs = svg.append("defs");
    defs.append("path")
    .attr("id", "outline")
    .attr("d", path(outline));

    defs.append("clipPath")
      .attr("id", "clip")
    .append("use");
      //.attr("xlink:href", new URL("#outline", location));
    let myData = topoData;
    const g = svg.append("g");
    let countries = topojson.feature(myData, myData.objects.countries);
    g.append("use").attr("fill","white");
    g.append("g")
    .selectAll("path")
    .data(countries.features)
    .join("path")
      .attr("fill",  d => color(this.props.data[d.properties.name]))
      .attr("d", path)
    .append("title");

  }

  render() {
    return (
      <div>
        <p>Global Map</p>
        <div className="theChart">
        </div>
      </div>
    );
  }
}

export default TestCharts;