import * as dateFnsLocales from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import React, { useRef } from 'react';
import { useLogRetention } from '../../data/hooks/useLogRetention';
import { Service, Stream } from '../../data/types/dbaas/logs';
import { parseAndFormatDuration } from '../../helpers/duration';

export const DATA_STREAM_RETENTION_LOADING_TEST_ID =
  'data-stream-retention-loading-test-id';

export type DataStreamRetentionProps = Pick<
  Stream,
  'retentionId' | 'clusterId'
> &
  Pick<Service, 'serviceName'>;

const DataStreamRetention = ({
  serviceName,
  clusterId,
  retentionId,
}: DataStreamRetentionProps) => {
  const { t } = useTranslation('error');

  const { i18n } = useTranslation();
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);
  const { data: retention, isPending, error } = useLogRetention(
    serviceName,
    clusterId,
    retentionId,
  );

  if (isPending)
    return <OdsSkeleton data-testid={DATA_STREAM_RETENTION_LOADING_TEST_ID} />;

  if (error) return <span>{t('error_datagrid_cell')}</span>;

  const { duration } = retention;

  return (
    <>
      {duration
        ? parseAndFormatDuration(duration, {
            locale: locales[userLocale as keyof typeof locales],
            delimiter: ', ',
          })
        : '-'}
    </>
  );
};

export default DataStreamRetention;
