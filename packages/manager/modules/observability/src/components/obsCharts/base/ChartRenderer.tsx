import React, { lazy, Suspense } from 'react';
import UnknownChart from '../UnknownChart';
import { ObsChart, ObsChartType } from '../../../types';
import { ObsSpinner } from '../../obsLoaders';

const LazyObsTimeSeriesChart = lazy(() => import('../ObsTimeSeriesChart'));
const LazyObsBarChart = lazy(() => import('../ObsBarChart'));
const LazyObsStackedBarChart = lazy(() => import('../ObsStackedBarChart'));
const LazyObsPieChart = lazy(() => import('../ObsPieChart'));

export interface ObsChartProps {
  id: string;
  title: string;
  data: any[];
  chart: ObsChart;
  isLoading: boolean;
  isFullscreen?: boolean;
}

export interface ChartRendererProps extends ObsChartProps {
  type: ObsChartType;
}

const LoadingDataSpinner = ({ id }: { id: string }) => (
  <div className="w-full h-full flex items-center justify-center">
    <ObsSpinner message={`loading data ${id}`} />
  </div>
);

const LoadingChartComponentSpinner = ({ type }: { type: string }) => (
  <div className="w-full h-full flex items-center justify-center">
    <ObsSpinner message={`loading chart ${type}`} />
  </div>
);

const NoDataComponent = () => (
  <div className="w-full h-full flex justify-center items-center">
    <span className="heading-1 font-extrabold">NO DATA</span>
  </div>
);

const ChartRendererBase = ({ type, ...rest }: Readonly<ChartRendererProps>) => {
  const { id, isLoading, data } = rest;

  if (isLoading) return <LoadingDataSpinner id={id} />;

  if (!data || data.length === 0) return <NoDataComponent />;

  let ChartComponent: React.ReactElement;
  switch (type) {
    case ObsChartType.TimeSeries:
      ChartComponent = <LazyObsTimeSeriesChart {...rest} />;
      break;
    case ObsChartType.Bars:
      ChartComponent = <LazyObsBarChart {...rest} />;
      break;
    case ObsChartType.StackedBars:
      ChartComponent = <LazyObsStackedBarChart {...rest} />;
      break;
    case ObsChartType.Pie:
      ChartComponent = <LazyObsPieChart {...rest} />;
      break;
    default:
      ChartComponent = <UnknownChart message={`type: ${String(type)}`} />;
  }

  return (
    <Suspense fallback={<LoadingChartComponentSpinner type={String(type)} />}>
      {ChartComponent}
    </Suspense>
  );
};

export const ChartRenderer = React.memo(ChartRendererBase, (prev, next) => {
  if (
    prev.type !== next.type ||
    prev.id !== next.id ||
    prev.isLoading !== next.isLoading
  ) {
    return false;
  }

  const prevLen = prev.data?.length ?? -1;
  const nextLen = next.data?.length ?? -1;
  if (prevLen !== nextLen || prev.data !== next.data) {
    return false;
  }

  return true;
});
