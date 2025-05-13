import { OdsBadge } from '@ovhcloud/ods-components/react';
import React from 'react';
import {
  OdsBadge as OdsBadgeType,
  ODS_BADGE_COLOR,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { Stream } from '../../data/types/dbaas/logs';

export const DATA_STREAM_INDEXING_STATUS_TEST_ID =
  'data-stream-indexing-status-test-id';

export type DataStreamIndexingProps = Partial<
  Omit<OdsBadgeType, 'color' | 'label'>
> &
  Pick<Stream, 'indexingEnabled'>;

const DataStreamIndexingStatus = ({
  indexingEnabled,
  size = 'md',
  ...props
}: DataStreamIndexingProps) => {
  const { t } = useTranslation('logStream');

  const label = indexingEnabled
    ? t('log_stream_indexing_active')
    : t('log_stream_indexing_inactive');
  const color: ODS_BADGE_COLOR = indexingEnabled
    ? ODS_BADGE_COLOR.success
    : ODS_BADGE_COLOR.warning;

  return (
    <OdsBadge
      label={label}
      size={size}
      color={color}
      data-testid={DATA_STREAM_INDEXING_STATUS_TEST_ID}
      {...props}
    />
  );
};

export default DataStreamIndexingStatus;
