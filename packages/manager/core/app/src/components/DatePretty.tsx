import React, { useEffect, useState } from 'react';
import { useShell } from '@/core';

export type DatePrettyProps = {
  date: Date;
  formatOptions?: Intl.DateTimeFormatOptions;
};

export default function DatePretty({
  date,
  formatOptions,
}: DatePrettyProps): JSX.Element {
  const [dateLabel, setDateLabel] = useState('');
  const shell = useShell();
  useEffect(() => {
    shell.i18n.getLocale().then((locale: string) => {
      setDateLabel(
        new Intl.DateTimeFormat(
          locale.replace('_', '-'),
          formatOptions || {
            dateStyle: 'long',
            timeStyle: 'medium',
          },
        ).format(new Date(date)),
      );
    });
  }, [date]);
  return <>{dateLabel}</>;
}
