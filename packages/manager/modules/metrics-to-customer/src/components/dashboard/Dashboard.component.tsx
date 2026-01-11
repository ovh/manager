import { useMemo } from 'react';

import { useDashboardContext } from '@/contexts';

import { ChartRenderer } from '../charts/base';
import { TimeControls } from '../timeControls/TimeControls.component';
import { ChartWidgetComponent } from '../widget/ChartWidget.component';
import { ChartWidgetWithData } from '../widget/ChartWidgetWithData.type';
import { DashboardProps } from './Dashboard.props';

export const Dashboard = <TData,>({
  charts: widgets,
}: Readonly<DashboardProps<TData>>): JSX.Element => {
  const { state, setState } = useDashboardContext();

  const onStateChange = <TValue,>(key: string, value: TValue) => {
    setState({ ...state, [key]: value });
  };

  const isDashboardLoading = useMemo(() => widgets.some((w) => w.isLoading), [widgets]);

  return (
    <section>
      <div className="w-full my-6 flex justify-end items-center">
        <TimeControls
          defaultValue={state.selectedTimeOption.value}
          isLoading={isDashboardLoading}
          state={state}
          onStateChange={onStateChange}
        />
      </div>
      <div
        className="grid gap-8 grid-cols-1 lg:grid-cols-4
          overflow-auto items-stretch content-stretch
          [grid-template-rows:repeat(2,calc((100vh-154px)/2))]
          [grid-auto-rows:calc((100vh-154px)/2)]
        "
      >
        {widgets.map((widget: ChartWidgetWithData<TData>, index: number) => {
          const { id, chart, colspan, rowspan, isLoading, title, unit, tooltip, data } = widget;

          return (
            <ChartWidgetComponent
              key={`dashboard-chart-${id}-${index}`}
              id={id}
              title={title}
              unit={unit}
              tooltip={tooltip}
              isLoading={isLoading}
              colspan={colspan}
              rowspan={rowspan}
            >
              <ChartRenderer
                type={chart.type}
                id={id}
                title={title}
                data={data}
                chartConfig={chart}
                isLoading={isLoading}
                state={state}
              />
            </ChartWidgetComponent>
          );
        })}
      </div>
    </section>
  );
};

export default Dashboard;
