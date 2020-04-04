import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { GradientTealBlue } from '@vx/gradient';
import { scaleBand, scaleLinear } from '@vx/scale';

// accessors
const x = d => d.letter;
const y = d => +d.frequency * 100;

class MyBars extends React.Component{
render(){
  // bounds
  const data = this.props.data;
  const xMax = this.props.width;
  const yMax = this.props.height - 120;

  // scales
  const xScale = scaleBand({
    rangeRound: [0, xMax],
    domain: data.map(x),
    padding: 0.4
  });
  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, Math.max(...data.map(y))]
  });
  return (
    <svg width={this.props.width} height={this.props.height}>
      <GradientTealBlue id="teal" />
      <rect width={this.props.width} height={this.props.height} fill={"white"} rx={14} />
      <Group top={40}>
        {data.map((d, i) => {
          const letter = x(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(y(d));
          const barX = xScale(letter);
          const barY = yMax - barHeight;
          return (
            <Bar
              key={`bar-${letter}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={this.props.color}
              /*onClick={event => {
                alert(`clicked: ${JSON.stringify(Object.values(d))}`);
              }}*/
            />
          );
        })}
      </Group>
    </svg>
  );
};
}

export default MyBars;