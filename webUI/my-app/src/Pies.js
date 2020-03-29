import React from 'react';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { GradientPinkBlue } from '@vx/gradient';
import { browserUsage } from '@vx/mock-data';

const black = '#000000';

const browserNames = Object.keys(browserUsage[0]).filter(k => k !== 'date');
const browsers = browserNames.map(k => ({ label: k, usage: browserUsage[0][k] }));

const usage = d => d.usage;

class MyPie extends React.Component {


  render() {
    const radius = Math.min(this.props.width, this.props.height) / 2;
    const centerY = this.props.height / 2;
    const centerX = this.props.width / 2;
      return (
    <svg width={this.props.width} height={this.props.height}>
      <GradientPinkBlue id="pie-gradients" />
      <rect rx={14} width={this.props.width} height={this.props.eight} fill={"white"} />
      <Group top={centerY} left={centerX}>
        <Pie
          data={this.props.data}
          pieValue={usage}
          outerRadius={radius - 80}
          innerRadius={radius - 120}
          cornerRadius={3}
          padAngle={0}
        >
          {pie => {
            return pie.arcs.map((arc, i) => {
              const opacity = 1 / (i + 2);
              const [centroidX, centroidY] = pie.path.centroid(arc);
              const { startAngle, endAngle } = arc;
              const hasSpaceForLabel = endAngle - startAngle >= 0.1;
              return (
                <g key={`browser-${arc.data.label}-${i}`}>
                  <path d={pie.path(arc)} fill={arc.data.label} fillOpacity={opacity} />
                  {hasSpaceForLabel && (
                    <text
                      fill={black}
                      x={centroidX}
                      y={centroidY}
                      dy=".33em"
                      fontSize={9}
                      textAnchor="middle"
                    >
                      {arc.data.label}:{arc.data.usage}
                    </text>
                  )}
                </g>
              );
            });
          }}
        </Pie>
      </Group>
    </svg>
  );
        }
};

export default MyPie;