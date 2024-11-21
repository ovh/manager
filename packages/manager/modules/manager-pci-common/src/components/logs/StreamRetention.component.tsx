import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDuration } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { useRetention } from '../../api/hook/useDbaasLogs';

export interface StreamRetentionProps {
  serviceName: string;
  clusterId: string;
  retentionId: string;
}

export const parseRetentionDuration = (duration = '') => {
  const [daysPart, timePart] = duration.split('T');
  const parse = (part: string, key: string) =>
    Number((part || '').match(new RegExp(`([0-9]+)${key}`))?.[1]) || 0;
  return {
    years: parse(daysPart, 'Y'),
    months: parse(daysPart, 'M'),
    days: parse(daysPart, 'D'),
    hours: parse(timePart, 'H'),
    minutes: parse(timePart, 'M'),
    seconds: parse(timePart, 'S'),
  };
};

export function StreamRetention({
  serviceName,
  clusterId,
  retentionId,
}: StreamRetentionProps) {
  const { i18n } = useTranslation();
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);
  const { data: retention, isPending } = useRetention(
    serviceName,
    clusterId,
    retentionId,
  );
  return (
    <>
      {isPending && <OsdsSkeleton />}
      {!isPending && !retention?.duration && '-'}
      {!isPending &&
        retention?.duration &&
        formatDuration(parseRetentionDuration(retention?.duration), {
          locale: locales[userLocale as keyof typeof locales],
        })}
    </>
  );
}
