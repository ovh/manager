import React, { Suspense, lazy } from 'react';
import { useDateFnsLocale } from '@ovh-ux/muk';

import { CHART_TYPE } from '@/types/charts/base/Chart.type';
import { ChartRendererProps } from '@/components/charts/base/ChartRenderer.props';
import LoadingChartSpinnerComponent from '@/components/charts/base/LoadingChartSpinner.component';
import NoDataComponent from '@/components/charts/base/NoData.component';

const LazyUnknownChart = lazy(() => import('@/components/charts/unknown/UnknownChart.component'));
const LazyTimeSeriesChart = lazy(() => import('@/components/charts/timeseries/TimeSeriesChart.component'));
const LazyBarsChart = lazy(() => import('@/components/charts/bars/BarsChart.component'));

export const ChartRendererComponent = <TData,>({
  type,
  ...rest
}: Readonly<ChartRendererProps<TData>>) => {
  const { isLoading, data } = rest;
  const dateFnsLocale = useDateFnsLocale();
  const locale = dateFnsLocale.code;

  if (!isLoading && (!data || data.length === 0)) return <NoDataComponent />;

  let ChartComponent: React.ReactElement;
  switch (type) {
    case CHART_TYPE.TIME_SERIES:
      ChartComponent = <LazyTimeSeriesChart {...rest} locale={locale} />;
      break;
    case CHART_TYPE.BARS:
      ChartComponent = <LazyBarsChart {...rest} locale={locale} />;
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
