import React from 'react';
import {
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LegendProps,
} from 'recharts';
import { ColorScale } from './config/theme';
import { ObsChartProps } from '../../types';

export type ObsStackedBarChartProps = ObsChartProps;

const ObsStackedBarChart = ({
  data,
}: Readonly<ObsStackedBarChartProps>): JSX.Element => {
  const barSize = 25;

  const legendPayload: LegendProps['payload'] = [
    { value: 'used', type: 'circle', color: '#0040D7', id: 'used' },
    { value: 'snapshot', type: 'circle', color: '#4BB2F6', id: 'snapshot' },
    { value: 'available', type: 'circle', color: '#000E9C', id: 'available' },
  ];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={100}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            alignmentBaseline="central"
            hide={true}
          />
          <Bar
            barSize={barSize}
            dataKey="used"
            stackId="a"
            fill={ColorScale.darkest}
          />
          <Bar
            barSize={barSize}
            dataKey="snapshot"
            stackId="a"
            fill={ColorScale.primary}
          />
          <Bar
            barSize={barSize}
            dataKey="available"
            stackId="a"
            fill={ColorScale.light}
          />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ paddingLeft: 20, marginTop: 10 }}>
        <Legend
          layout="vertical"
          align="left"
          verticalAlign="top"
          wrapperStyle={{ position: 'relative' }}
          payload={legendPayload}
        />
      </div>
    </div>
  );
};

export default ObsStackedBarChart;
