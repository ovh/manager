import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';
import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';
import { getChartsData } from '@/utils/formatter/formatter';
import { isInstanceFlavor } from '@/utils/savingsPlan';

interface ChartProps {
  chartTitle: string;
  consumption: SavingsPlanFlavorConsumption;
  flavor: string;
}

const GRAPH_SIZE_ZOOM = 1.1;

const getMaxRangeGraph = (maxValue: number) =>
  Math.round(maxValue * GRAPH_SIZE_ZOOM);

const INCLUDED_COLOR = 'rgba(0, 128, 0, 0.6)';
const EXCLUDED_COLOR = 'rgba(255, 192, 203, 0.6)';

const GenericChart: React.FC<ChartProps> = ({
  chartTitle,
  consumption,
  flavor,
}) => {
  const { t } = useTranslation('dashboard');

  const chartData = useMemo(() => getChartsData(consumption.periods ?? []), [
    consumption.periods,
  ]);

  const maxRange = useMemo(
    () =>
      getMaxRangeGraph(
        Math.max(
          ...chartData.map((d) => d.included + d.excluded + d.cumulPlanSize),
        ),
      ),
    [chartData],
  );
  const yAxisLabel = isInstanceFlavor(flavor)
    ? t('dashboard_graph_y_axis_label')
    : t('dashboard_graph_y_axis_label_vcpu');

  return (
    <>
      <OdsText preset="heading-4" className="my-8">
        {chartTitle}
      </OdsText>
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
            label={{
              value: t('dashboard_graph_x_axis_label'),
              position: 'insideBottom',
              offset: -10,
              fontSize: 12,
            }}
          />
          <YAxis
            domain={[0, maxRange]}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              offset: -10,
              fontSize: 12,
            }}
          />
          <Tooltip />
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }}
            payload={[
              {
                value: t('dashboard_graph_included'),
                type: 'square',
                color: INCLUDED_COLOR,
              },
              {
                value: t('dashboard_graph_excluded'),
                type: 'square',
                color: EXCLUDED_COLOR,
              },
            ]}
          />

          <Area
            type="step"
            dataKey="included"
            stackId="2"
            stroke="#008000"
            fill={INCLUDED_COLOR}
            name={t('dashboard_graph_included')}
          />
          <Area
            type="step"
            dataKey="excluded"
            stackId="2"
            stroke="#FFC0CB"
            fill={EXCLUDED_COLOR}
            name={t('dashboard_graph_excluded')}
          />
          <Area
            type="step"
            dataKey="cumulPlanSize"
            stackId="1"
            stroke="red"
            strokeWidth={2}
            fill="white"
            name={t('dashboard_columns_cumul_plan_size')}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default GenericChart;
