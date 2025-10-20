import React from 'react';

import { ChartRendererComponent } from './ChartRenderer.component';
import { ChartRendererProps } from './ChartRenderer.props';

const MemoizedChartRenderer = React.memo(ChartRendererComponent, (prev, next) => {
  if (prev.type !== next.type || prev.id !== next.id || prev.isLoading !== next.isLoading) {
    return false;
  }

  const prevLen = prev.data?.length ?? -1;
  const nextLen = next.data?.length ?? -1;
  return prevLen === nextLen && prev.data === next.data;
});

export const ChartRenderer = <TData,>(props: ChartRendererProps<TData>) => {
  return <MemoizedChartRenderer {...props} />;
};
