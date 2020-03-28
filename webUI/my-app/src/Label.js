import React from 'react';
import { format } from 'd3-format';
import * as d3 from 'd3';

import {
    LegendLinear,
    LegendItem,
    LegendLabel
  } from '@vx/legend';

  const oneDecimalFormat = format('.1f');

  class Label extends React.Component {

    state = {
  
    };

    render() {
      let color = d3.scaleSequential()
        .domain(d3.extent(this.props.dataArray))
        .interpolator(d3.interpolateReds)
        .unknown("#ccc");
      return(
      <div className="theLabel">
                      <LegendLinear
          scale={color}
          labelFormat={(d, i) => {
            if (i % 2 === 0) return oneDecimalFormat(d);
            return '';
          }}
        >
          {labels => {
            return labels.map((label, i) => {
              const size = 15;
              return (
                <LegendItem
                  key={`legend-quantile-${i}`}
                >
                  <svg width={size} height={size} style={{ margin: '2px 0' }}>
                    <circle fill={label.value} r={size / 2} cx={size / 2} cy={size / 2} />
                  </svg>
                  <LegendLabel align={'left'} margin={'0 4px'}>
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              );
            });
          }}
        </LegendLinear>
          </div>
        )      }
}

export default Label;