import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';

interface DatagridColumnContactProps {
  readonly contact: string;
}

export default function DatagridColumnContact({
  contact,
}: Readonly<DatagridColumnContactProps>) {
  if (!contact) {
    return '';
  }

  return <DataGridTextCell>{contact}</DataGridTextCell>;
}
