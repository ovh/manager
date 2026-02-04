import React, { useMemo } from 'react';

import { de, enGB, es, fr, frCA, it, pl, pt } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import { Skeleton } from '@ovhcloud/ods-react';

import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

import { NAMESPACES } from '@/LogsToCustomer.translations';
import { useLogRetention } from '@/data/hooks/useLogRetention';
import { Service, Stream } from '@/data/types/dbaas/logs/Logs.type';
import { parseAndFormatDuration } from '@/helpers/duration';

export const DATA_STREAM_RETENTION_LOADING_TEST_ID = 'data-stream-retention-loading-test-id';

export type DataStreamRetentionProps = Pick<Stream, 'retentionId' | 'clusterId'> &
  Pick<Service, 'serviceName'>;

const locales = { fr, de, enGB, es, frCA, it, pl, pt };

const DataStreamRetention = ({ serviceName, clusterId, retentionId }: DataStreamRetentionProps) => {
  const { t } = useTranslation(NAMESPACES.ERROR);

  const { i18n } = useTranslation();
  const userLocale = getDateFnsLocale(i18n.language);
  const {
    data: retention,
    isPending,
    error,
  } = useLogRetention(serviceName, clusterId, retentionId);

  const duration = retention?.duration;
  const formattedDuration = useMemo(() => {
    if (!duration) return '-';
    return parseAndFormatDuration(duration, {
      locale: locales[userLocale as keyof typeof locales],
      delimiter: ', ',
    });
  }, [duration, userLocale]);

  if (isPending) return <Skeleton data-testid={DATA_STREAM_RETENTION_LOADING_TEST_ID} />;

  if (error) return <span>{t('error_datagrid_cell')}</span>;

  return <>{formattedDuration}</>;
};

export default DataStreamRetention;
