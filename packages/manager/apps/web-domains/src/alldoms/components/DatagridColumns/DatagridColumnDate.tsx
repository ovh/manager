import {
  DataGridTextCell,
  DateFormat,
  useFormattedDate,
} from '@ovh-ux/manager-react-components';
import React from 'react';

interface DatagridColumnDateProps {
  readonly expirationDate: string;
}

export function DatagridColumnDate({
  expirationDate,
}: DatagridColumnDateProps) {
  const date = useFormattedDate({
    dateString: expirationDate,
    format: DateFormat.compact,
  });

  return <DataGridTextCell>{date}</DataGridTextCell>;
}
