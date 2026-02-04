import React from 'react';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, BADGE_SIZE, Badge, BadgeProp } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/LogsToCustomer.translations';
import { Stream } from '@/data/types/dbaas/logs/Logs.type';

export const DATA_STREAM_INDEXING_STATUS_TEST_ID = 'data-stream-indexing-status-test-id';

export type DataStreamIndexingProps = Partial<Omit<BadgeProp, 'color'>> &
  Pick<Stream, 'indexingEnabled'>;

const DataStreamIndexingStatus = ({
  indexingEnabled,
  size = BADGE_SIZE.md,
  ...props
}: DataStreamIndexingProps) => {
  const { t } = useTranslation(NAMESPACES.LOG_STREAM);

  const label = indexingEnabled
    ? t('log_stream_indexing_active')
    : t('log_stream_indexing_inactive');
  const color = indexingEnabled ? BADGE_COLOR.success : BADGE_COLOR.warning;

  return (
    <Badge size={size} color={color} data-testid={DATA_STREAM_INDEXING_STATUS_TEST_ID} {...props}>
      {label}
    </Badge>
  );
};

export default DataStreamIndexingStatus;
