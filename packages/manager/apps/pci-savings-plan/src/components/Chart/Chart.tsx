import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
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
  Line,
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

const areaChartColors = {
  included: { fill: 'rgba(0, 128, 0, 0.6)', stroke: '#008000' },
  excluded: { fill: '#CF334E', stroke: '#CF334E' },
  cumulPlanSize: { fill: 'white', stroke: '#157EEA' },
};

const GenericChart: React.FC<ChartProps> = ({
  chartTitle,
  consumption,
  flavor,
}) => {
  const { t } = useTranslation('dashboard');
  const { i18n } = useTranslation('pci-common');
  const userLocale = getDateFnsLocale(i18n.language);
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
    <div className="border border-gray-100 p-4 my-8 rounded-sm">
      <OdsText preset="heading-4" className="my-8 ml-4">
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
              fontSize: 12,
            }}
            {...(maxRange <= 1 ? { ticks: [0, 1] } : {})}
          />
          <Tooltip
            formatter={(value) => <OdsText>{value}</OdsText>}
            labelFormatter={(_, payload) => {
              const date = payload?.[0]?.payload?.date ?? null;

              const formattedText = date
                ? format(date, 'd MMM yyyy', {
                    locale:
                      dateFnsLocales[userLocale as keyof typeof dateFnsLocales],
                  })
                : '';
              return <OdsText>{formattedText}</OdsText>;
            }}
          />

          <Legend
            formatter={(value) => (
              <span className="text-[--ods-color-blue-800]">{value}</span>
            )}
            verticalAlign="top"
            align="center"
            wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }}
            payload={[
              {
                value: t('dashboard_graph_included'),
                type: 'square',
                color: areaChartColors.included.fill,
              },
              {
                value: t('dashboard_graph_excluded'),
                type: 'square',
                color: areaChartColors.excluded.fill,
              },
            ]}
          />

          <Area
            type="step"
            dataKey="included"
            stackId="2"
            stroke={areaChartColors.included.stroke}
            fill={areaChartColors.included.fill}
            name={t('dashboard_graph_included')}
          />
          <Area
            type="step"
            dataKey="excluded"
            stackId="2"
            fill={areaChartColors.excluded.fill}
            stroke={areaChartColors.excluded.stroke}
            name={t('dashboard_graph_excluded')}
          />
          <Area
            type="step"
            dataKey="cumulPlanSize"
            stackId="1"
            stroke={areaChartColors.cumulPlanSize.stroke}
            strokeWidth={2}
            fill={areaChartColors.cumulPlanSize.fill}
            name={t('dashboard_columns_cumul_plan_size')}
          />

          <Line type="basis" dataKey="date" fillOpacity={0} strokeOpacity={0} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenericChart;
