import React from 'react';

import { useFormattedDate } from '@key-management-service/hooks/useFormattedDate';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

type FormattedDateProps = {
  value: string;
  options: Intl.DateTimeFormatOptions;
};

export const TileValueDate: React.FC<FormattedDateProps> = ({ value, options }) => {
  const date = new Date(Date.parse(value));

  const formattedDate = useFormattedDate({
    date,
    options,
  });

  return <OdsText preset={ODS_TEXT_PRESET.span}>{formattedDate}</OdsText>;
};
