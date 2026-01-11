import React, { Suspense, lazy } from 'react';

import { CHART_TYPE } from './Chart.type';
import { ChartRendererProps } from './ChartRenderer.props';
import LoadingChartSpinnerComponent from './LoadingChartSpinner.component';
import NoDataComponent from './NoData.component';

const LazyUnknownChart = lazy(() => import('../unknown/UnknownChart.component'));
const LazyTimeSeriesChart = lazy(() => import('../timeseries/TimeSeriesChart.component'));
const LazyBarsChart = lazy(() => import('../bars/BarsChart.component'));

export const ChartRendererComponent = <TData,>({
  type,
  ...rest
}: Readonly<ChartRendererProps<TData>>) => {
  const { isLoading, data } = rest;

  if (!isLoading && (!data || data.length === 0)) return <NoDataComponent />;

  let ChartComponent: React.ReactElement;
  switch (type) {
    case CHART_TYPE.TimeSeries:
      ChartComponent = <LazyTimeSeriesChart {...rest} />;
      break;
    case CHART_TYPE.Bars:
      ChartComponent = <LazyBarsChart {...rest} />;
      break;
    default:
      ChartComponent = <LazyUnknownChart message={`type: ${String(type)}`} />;
  }

  return (
    <Suspense fallback={<LoadingChartSpinnerComponent type={String(type)} />}>
      {ChartComponent}
    </Suspense>
  );
};
