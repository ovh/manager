import {
  DataGridTextCell,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import React from 'react';

interface DatagridColumnDateProps {
  readonly expirationDate: string;
}

export function DatagridColumnDate({
  expirationDate,
}: DatagridColumnDateProps) {
  const formatDate = useFormatDate();
  const date = formatDate({
    date: expirationDate,
    format: 'P',
  });

  return <DataGridTextCell>{date}</DataGridTextCell>;
}
