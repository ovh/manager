import { ChartWidget } from '@/components/widget/ChartWidget.type';
import { useChartData, useDashboardConfig } from '@/data/hooks';
import { RequestPayload } from '@/types/RequestPayload.type';
import { TimeRangeOption } from '@/types/TimeRangeOption.type';
import { buildQueryWithResourceUrn } from '@/utils/metrics.utils';
import { getWindowSecAndStep } from '@/utils/dateTimeUtils';
import { useQueryClient } from '@tanstack/react-query';
import getChartDataQueryKey from './getChartDataQueryKey';

type UseChartWithDataParams = {
  chartId: string;
  resourceName: string;
  productType: string;
  resourceURN: string;
  startDateTime?: number;
  endDateTime?: number;
  selectedTimeOption: TimeRangeOption;
  refreshInterval: number;
  metricToken: string;
};

export const useChartWithData = <TData>({
  chartId,
  resourceName,
  productType,
  resourceURN,
  startDateTime,
  endDateTime,
  selectedTimeOption,
  refreshInterval,
  metricToken,
}: UseChartWithDataParams) => {

  const queryClient = useQueryClient();

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
    query: buildQueryWithResourceUrn(chartConfig.query, resourceURN),
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
    refetch,    
  } = useChartData<TData>(requestPayload, refreshInterval, metricToken);

  const cancel = () => queryClient.cancelQueries({
    queryKey: getChartDataQueryKey(requestPayload, metricToken),
    exact: true,
  });

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
    refetch,
    cancel,
  };
};
