import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsChipAttribute,
  ODS_CHIP_SIZE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { Stream } from '../../data/types/dbaas/logs';

export const DATA_STREAM_INDEXING_STATUS_TEST_ID =
  'data-stream-indexing-status-test-id';

export type DataStreamIndexingProps = Omit<OdsChipAttribute, 'color'> &
  Pick<Stream, 'indexingEnabled'>;

const DataStreamIndexingStatus = ({
  indexingEnabled,
  size = ODS_CHIP_SIZE.sm,
  ...props
}: DataStreamIndexingProps) => {
  const { t } = useTranslation('logStream');

  const label = indexingEnabled
    ? t('log_stream_indexing_active')
    : t('log_stream_indexing_inactive');
  const color: ODS_TEXT_COLOR_INTENT = indexingEnabled
    ? ODS_TEXT_COLOR_INTENT.success
    : ODS_TEXT_COLOR_INTENT.warning;

  return (
    <OsdsChip
      size={size}
      color={color}
      data-testid={DATA_STREAM_INDEXING_STATUS_TEST_ID}
      {...props}
    >
      {label}
    </OsdsChip>
  );
};

export default DataStreamIndexingStatus;
