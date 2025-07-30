import React from 'react';

import { DataGridTextCell, useFormatDate } from '@ovh-ux/manager-react-components';

interface DatagridColumnDateProps {
  readonly expirationDate: string;
}

export function DatagridColumnDate({ expirationDate }: DatagridColumnDateProps) {
  const formatDate = useFormatDate();

  if (!expirationDate) {
    return '';
  }

  const date = formatDate({
    date: expirationDate,
    format: 'P',
  });

  return <DataGridTextCell>{date}</DataGridTextCell>;
}
