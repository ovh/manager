import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { ColorScale } from './config/theme';
import { ObsChartProps } from '../../types';

export type ObsBarChartProps = ObsChartProps;

const ObsBarChart = ({ data }: Readonly<ObsBarChartProps>): JSX.Element => {
  return (
    <ResponsiveContainer className="w-full h-full">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 50,
        }}
      >
        <Bar dataKey="value" fill={ColorScale.dark} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ObsBarChart;
