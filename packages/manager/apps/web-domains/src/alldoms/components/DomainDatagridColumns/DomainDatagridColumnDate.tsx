import {
  DataGridTextCell,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import React from 'react';

interface DomainDatagridColumnDateProps {
  readonly date: string;
}

export default function DomainDatagridColumnDate({
  date,
}: DomainDatagridColumnDateProps) {
  const formatDate = useFormatDate();

  return (
    <DataGridTextCell>
      {formatDate({
        date,
        format: 'P',
      })}
    </DataGridTextCell>
  );
}
