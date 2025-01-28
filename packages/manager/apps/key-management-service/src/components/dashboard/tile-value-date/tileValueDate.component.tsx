import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useFormattedDate } from '@/hooks/useFormattedDate';

type FormattedDateProps = {
  value: string;
  options: Intl.DateTimeFormatOptions;
};

export const TileValueDate: React.FC<FormattedDateProps> = ({
  value,
  options,
}) => {
  const date = new Date(Date.parse(value));

  const formattedDate = useFormattedDate({
    date,
    options,
  });

  return <OdsText preset={ODS_TEXT_PRESET.span}>{formattedDate}</OdsText>;
};
