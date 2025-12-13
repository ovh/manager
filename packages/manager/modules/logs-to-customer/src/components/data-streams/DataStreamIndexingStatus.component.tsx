import { Badge, BADGE_COLOR, BadgeProp } from '@ovhcloud/ods-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stream } from '@/data/types/dbaas/logs';
import { NAMESPACES } from '@/LogsToCustomer.translations';

export const DATA_STREAM_INDEXING_STATUS_TEST_ID =
  'data-stream-indexing-status-test-id';

export type DataStreamIndexingProps = Partial<
  Omit<BadgeProp, 'color' | 'label'>
> &
  Pick<Stream, 'indexingEnabled'>;

const DataStreamIndexingStatus = ({
  indexingEnabled,
  size = 'md',
  ...props
}: DataStreamIndexingProps) => {
  const { t } = useTranslation(NAMESPACES.LOG_STREAM);

  const label = indexingEnabled
    ? t('log_stream_indexing_active')
    : t('log_stream_indexing_inactive');
  const color = indexingEnabled
    ? BADGE_COLOR.success
    : BADGE_COLOR.warning;

  return (
    <Badge
      color={color}
      size={size}
      data-testid={DATA_STREAM_INDEXING_STATUS_TEST_ID}
      {...props}
    >
      {label}
    </Badge>
  );
};

export default DataStreamIndexingStatus;
