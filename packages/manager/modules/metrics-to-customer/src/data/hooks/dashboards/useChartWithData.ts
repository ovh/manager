import { ChartWidget } from '@/components/widget/ChartWidget.type';
import { useChartData, useDashboardConfig } from '@/data/hooks';
import { RequestPayload } from '@/types/RequestPayload.type';
import { TimeRangeOption } from '@/types/TimeRangeOption.type';
import { getWindowSecAndStep } from '@/utils/dateTimeUtils';

type UseChartWithDataParams = {
  chartId: string;
  resourceName: string;
  productType: string;
  startDateTime?: number;
  endDateTime?: number;
  selectedTimeOption: TimeRangeOption;
  refreshInterval: number;
};

export const useChartWithData = <TData>({
  chartId,
  resourceName,
  productType,
  startDateTime,
  endDateTime,
  selectedTimeOption,
  refreshInterval,
}: UseChartWithDataParams) => {
  const {
    data: dashboard,
    isLoading: configLoading,
    error: configError,
    isError: isConfigError,
  } = useDashboardConfig(resourceName, productType);

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
    step,
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
