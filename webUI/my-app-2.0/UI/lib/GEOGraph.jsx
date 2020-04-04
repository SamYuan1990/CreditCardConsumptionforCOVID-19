import React from 'react';
import * as topojson from 'topojson-client';
import { Mercator, Graticule } from '@vx/geo';
import topology from './utils';
import * as d3 from 'd3';

const bg = '#f9f7e8';

const world = topojson.feature(topology, topology.objects.countries);

class GEOGraph extends React.Component {

  render() {
    const centerX = this.props.width / 2;
    const centerY = this.props.height / 2;
    const scale = this.props.width / 630 * 100;
    const color = d3.scaleSequential()
      .domain(d3.extent(this.props.dataArray))
      .interpolator(d3.interpolateReds)
      .unknown("#ccc");
    return (
      <div>
        <svg width={this.props.width} height={this.props.height}>
      <rect x={0} y={0} width={this.props.width} height={this.props.height} fill={bg} rx={14} />
      <Mercator data={world.features} scale={scale} translate={[centerX, centerY + 50]}>
        {mercator => {
          return (
            <g>
              <Graticule graticule={g => mercator.path(g)} stroke={'rgba(33,33,33,0.05)'} />
              {mercator.features.map((feature, i) => {
                const { feature: f } = feature;
                return (
                  <path
                    key={`map-feature-${i}`}
                    d={mercator.path(f)}
                    fill={color(this.props.data[`${f.properties.name}`])}
                    stroke={bg}
                    strokeWidth={0.5}
                    onClick={event => {
                      alert(`clicked: ${f.properties.name} ${this.props.data[`${f.properties.name}`]}`);
                    }}
                  />
                );
              })}
            </g>
          );
        }}
      </Mercator>
    </svg>
      </div>
    );
  }
}

export default GEOGraph;