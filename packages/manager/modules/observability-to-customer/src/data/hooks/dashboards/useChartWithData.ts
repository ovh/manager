import { ChartWidget } from '../../../components/widget/ChartWidget.type';
import { RequestPayload } from '../../../types/RequestPayload.type';
import { TimeRangeOption } from '../../../types/TimeRangeOption.type';
import { getWindowSecAndStep } from '../../../utils/dateTimeUtils';
import { useChartData } from './useChartData';
import { useDashboardConfig } from './useDashboardConfig';

export const useChartWithData = <TData>(
  chartId: string,
  serviceName: string,
  productType: string,
  startDateTime: number | undefined,
  endDateTime: number | undefined,
  selectedTimeOption: TimeRangeOption,
  refreshInterval: number,
) => {
  const {
    data: dashboard,
    isLoading: configLoading,
    error: configError,
    isError: isConfigError,
  } = useDashboardConfig(serviceName, productType);

  const chartConfig: ChartWidget = dashboard?.currentState.find(
    (c) => c.id === chartId,
  ) as ChartWidget;

  const end: number = endDateTime ?? Math.floor(Date.now() / 1000);
  const { step, windowSec } = getWindowSecAndStep(selectedTimeOption);
  const start: number = startDateTime ?? end - windowSec;

  const requestPayload: RequestPayload = {
    query: chartConfig.query,
    start,
    end,
    step: step,
    type: 'query_range',
  };

  // fetch chart data
  const {
    data: chartData,
    isLoading: dataLoading,
    error: dataError,
    isError: isDataError,
  } = useChartData<TData>(requestPayload, refreshInterval);

  const isLoading = configLoading || dataLoading;

  const error = configError || dataError;
  const isError = isConfigError || isDataError;

  return {
    config: chartConfig,
    data: chartData,
    isLoading,
    error,
    isError,
    configError,
    dataError,
    isConfigError,
    isDataError,
  };
};
