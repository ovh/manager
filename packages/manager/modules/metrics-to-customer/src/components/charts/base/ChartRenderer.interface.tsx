import React from 'react';

import { ChartRendererComponent } from '@/components/charts/base/ChartRenderer.component';
import { ChartRendererProps } from '@/components/charts/base/ChartRenderer.props';

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
