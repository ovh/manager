import {
  OdsBadge as OdsBadgeType,
  ODS_BADGE_COLOR,
} from '@ovhcloud/ods-components';
import { render } from '@testing-library/react';
import React from 'react';
import { Stream } from '../../data/types/dbaas/logs';
import DataStreamIndexingStatus, {
  DATA_STREAM_INDEXING_STATUS_TEST_ID,
} from './DataStreamIndexingStatus.component';

describe('data-stream indexing status', () => {
  type TTestCases = {
    indexingEnabled: Stream['indexingEnabled'];
    color: OdsBadgeType['color'];
    label: string;
  };

  const testCases: TTestCases[] = [
    {
      indexingEnabled: false,
      color: ODS_BADGE_COLOR.warning,
      label: 'log_stream_indexing_inactive',
    },
    {
      indexingEnabled: true,
      color: ODS_BADGE_COLOR.success,
      label: 'log_stream_indexing_active',
    },
  ];

  it.each(testCases)(
    'should render correct chip for state: $indexingEnabled',
    ({ indexingEnabled, color, label }) => {
      const { getByTestId } = render(
        <DataStreamIndexingStatus indexingEnabled={indexingEnabled} />,
      );

      const comp = getByTestId(DATA_STREAM_INDEXING_STATUS_TEST_ID);
      expect(comp).toHaveAttribute('label', label);
      expect(comp).toHaveAttribute('color', color);
    },
  );
});
