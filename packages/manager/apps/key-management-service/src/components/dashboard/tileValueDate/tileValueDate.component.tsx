import React from 'react';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { TileValue } from '../tileValue/tileValue.component';

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

  return <TileValue value={formattedDate} />;
};
