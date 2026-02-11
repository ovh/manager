import { useMemo } from 'react';

import { useDashboardContext, useMetricsToCustomerContext } from '@/contexts';

import { ChartWidgetWithData } from '@/types/widget/ChartWidgetWithData.type';

import { ChartRenderer } from '@/components/charts/base';
import { TimeControls } from '@/components/timeControls/TimeControls.component';
import { ChartWidgetComponent } from '@/components/widget/ChartWidget.component';
import { DashboardProps } from '@/components/dashboard/Dashboard.props';
import ManageConfigurationButton from '@/components/cta/ManageConfigurationButton.component';
import { getSubscriptionsConfigUrl } from '@/routes/Routes.utils';

export const Dashboard = <TData,>({
  charts: widgets,
  disabled = false,
  onRefresh,
  onCancel,
}: Readonly<DashboardProps<TData>>): JSX.Element => {

  const { state: metricsToCustomerState } = useMetricsToCustomerContext();

  const { enableConfigurationManagement } = metricsToCustomerState;

  const { state, setState } = useDashboardContext();

  const onStateChange = <TValue,>(key: string, value: TValue) => {

    // Allow updating multiple fields at once when a composite key is used
    if (key === 'dateRange' && typeof value === 'object' && value !== null) {
      setState((prevState) => ({
        ...prevState,
        ...(value as Partial<typeof prevState>),
      }));
      return;
    }

    // Default behaviour: update a single key
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const isDashboardLoading = useMemo(() => widgets.some((w) => w.isLoading), [widgets]);

  return (
    <section>
      <div className="w-full flex flex-col gap-8">
        <div className="flex justify-end items-center">
          {enableConfigurationManagement && (
            <ManageConfigurationButton configUrl={getSubscriptionsConfigUrl()} />
          )}
        </div>
        <div className="flex justify-end items-center">
          <TimeControls
            id="dashboard-time-controls"
            defaultValue={state.selectedTimeOption.value}
            isLoading={isDashboardLoading}
            state={state}
            onStateChange={onStateChange}
            onRefresh={onRefresh}
            onCancel={onCancel}
            disabled={disabled}
          />
        </div>
        <div
          className="grid gap-8 grid-cols-1 lg:grid-cols-4
          overflow-auto items-stretch content-stretch
          [grid-template-rows:repeat(2,calc((100vh-154px)/4))]
          [grid-auto-rows:calc((100vh-154px)/4)]
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
                disabled={disabled}
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
      </div>
    </section>
  );
};

export default Dashboard;
