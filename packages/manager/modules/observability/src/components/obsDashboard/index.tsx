import React from 'react';
import { ObsChartWithData } from '../../types';
import { ChartRenderer, ChartWidget } from '../obsCharts';
import { ObsTimeControls } from '../obsTimeControls';
import { useDashboard } from '../../contexts';

export interface ObsDashboardProps {
  widgets: any[];
}

export const ObsDashboard = ({
  widgets,
}: Readonly<ObsDashboardProps>): JSX.Element => {
  const { state, setState } = useDashboard();

  return (
    <section>
      <div className="w-full my-6 flex justify-end items-center">
        <ObsTimeControls
          defaultValue={state.selectedTimeOption}
          onValueChange={(range) =>
            setState({ ...state, selectedTimeOption: range })
          }
        />
      </div>
      <div
        className="
          grid gap-8 grid-cols-1 lg:grid-cols-4 
          h-[calc(100vh-130px)] max-h-[calc(100vh-130px)]
          overflow-auto items-stretch content-stretch
          [grid-template-rows:repeat(2,calc((100vh-154px)/2))]
          [grid-auto-rows:calc((100vh-154px)/2)]
        "
      >
        {widgets.map((widget: ObsChartWithData) => {
          const {
            id,
            chart,
            colspan,
            rowspan,
            isLoading,
            title,
            unit,
            tooltip,
            query,
            data,
          } = widget;

          return (
            <ChartWidget
              key={`dashboard-chart-${id}`}
              id={id}
              title={title}
              unit={unit}
              tooltip={tooltip}
              isLoading={isLoading}
              colspan={colspan}
              rowspan={rowspan}
              query={query}
            >
              <ChartRenderer
                type={chart.type}
                id={id}
                title={title}
                data={data}
                chart={chart}
                isLoading={isLoading}
              />
            </ChartWidget>
          );
        })}
      </div>
    </section>
  );
};
