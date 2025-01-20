import React from 'react';
import {
  DateFormat,
  useFormattedDate,
} from '../../hooks/date/useFormattedDate';

type FormattedDateProps = {
  dateString: string;
  unknownDateLabel?: string;
  defaultLocale?: string;
  format?: DateFormat;
};

export const FormattedDate: React.FC<FormattedDateProps> = (props) => {
  const formattedDate = useFormattedDate(props);

  return <>{formattedDate}</>;
};
