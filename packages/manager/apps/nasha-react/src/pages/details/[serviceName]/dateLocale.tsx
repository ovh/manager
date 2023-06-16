import React, { useState, useEffect } from 'react';
import { useShell } from '@ovh-ux/manager-react-core-application';

type DateLocaleProps = {
  date: Date;
  formatOptions?: Intl.DateTimeFormatOptions;
};

const DateLocale: React.FC<DateLocaleProps> = ({
  date,
  formatOptions = { dateStyle: 'long' },
}) => {
  const [dateLabel, setDateLabel] = useState('');
  const shell = useShell();

  useEffect(() => {
    const inputDate = new Date(date);
    shell.i18n.getLocale().then((locale: string) => {
      setDateLabel(
        new Intl.DateTimeFormat(locale.replace('_', '-'), formatOptions).format(
          inputDate,
        ),
      );
    });
  }, [date, formatOptions, shell.i18n]);

  return <>{dateLabel}</>;
};

export default DateLocale;
