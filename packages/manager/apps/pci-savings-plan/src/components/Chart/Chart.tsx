import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';

interface ChartProps {
  chartData: { day: string; inclus: number; exclus: number }[];
  maxRange: number;
  savingsPlanSize: number;
  serviceFilter: 'Instances' | 'Managed Rancher Services';
}

const GenericChart: React.FC<ChartProps> = ({
  chartData,
  maxRange,
  savingsPlanSize,
  serviceFilter,
}) => {
  const yAxisLabel =
    serviceFilter === 'Instances'
      ? "Nombre d'instance(s)"
      : 'Nombre de vCPU(s)';

  return (
    <ResponsiveContainer width="100%" height={400} className="ods-font">
      <AreaChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="day"
          label={{ value: 'Jour', position: 'insideBottom', offset: -10 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          domain={[0, maxRange]}
          label={{
            value: yAxisLabel,
            angle: -90,
            position: 'insideLeft',
            offset: -10,
          }}
          tickFormatter={(value) => value.toFixed(0)}
          tick={{ fontSize: 12 }}
        />
        <Tooltip formatter={(value: number) => value.toFixed(2)} />
        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ fontSize: '12px', marginBottom: '10px' }}
          payload={[
            {
              value: 'Inclus dans les Savings Plans',
              type: 'square',
              color: 'rgba(0, 128, 0, 0.6)',
            },
            {
              value: 'Exclus des Savings Plans',
              type: 'square',
              color: 'rgba(255, 192, 203, 0.6)',
            },
          ]}
        />
        <Area
          type="step"
          dataKey="inclus"
          stackId="1"
          stroke="#008000"
          fill="rgba(0, 128, 0, 0.6)"
          name="Inclus dans les Savings Plans"
        />
        <Area
          type="step"
          dataKey="exclus"
          stackId="1"
          stroke="#FFC0CB"
          fill="rgba(255, 192, 203, 0.6)"
          name="Exclus des Savings Plans"
        />
        <ReferenceLine
          y={savingsPlanSize}
          stroke="red"
          strokeWidth={2}
          label={{
            position: 'right',
            value: `${savingsPlanSize} ${
              serviceFilter === 'Instances' ? 'instance(s)' : 'vCPU(s)'
            }`,
            className: 'font-bold text-xs text-red-500',
            offset: 10,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default GenericChart;
