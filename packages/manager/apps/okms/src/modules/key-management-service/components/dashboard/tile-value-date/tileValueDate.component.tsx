import React from 'react';

import { useFormattedDate } from '@key-management-service/hooks/useFormattedDate';

import { Text } from '@ovhcloud/ods-react';

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

  return <Text preset="span">{formattedDate}</Text>;
};
