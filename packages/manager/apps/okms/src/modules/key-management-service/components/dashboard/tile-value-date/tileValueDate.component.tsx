import React from 'react';

import { useFormattedDate } from '@key-management-service/hooks/useFormattedDate';

import { Text } from '@ovhcloud/ods-react';

type FormattedDateProps = {
  value: string;
  options: Intl.DateTimeFormatOptions;
  'data-testid'?: string;
};

export const TileValueDate = ({
  value,
  options,
  'data-testid': dataTestId,
}: FormattedDateProps) => {
  const date = new Date(Date.parse(value));

  const formattedDate = useFormattedDate({
    date,
    options,
  });

  return (
    <Text preset="span" data-testid={dataTestId}>
      {formattedDate}
    </Text>
  );
};
