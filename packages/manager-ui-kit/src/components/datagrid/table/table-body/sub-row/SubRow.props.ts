import React from 'react';

import type { Row } from '@tanstack/react-table';

export interface SubRowProps<T = unknown> {
  maxRowHeight: number;
  offset: number;
  renderSubComponent: (row: Row<T>) => React.ReactNode;
  row: Row<T>;
  subComponentHeight: number;
  virtualRow: {
    index: number;
    start: number;
  };
  hideHeader: boolean;
}
