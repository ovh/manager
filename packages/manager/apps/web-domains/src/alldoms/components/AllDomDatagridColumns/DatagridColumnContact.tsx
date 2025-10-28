import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { Link } from '@ovhcloud/ods-react';
import React from 'react';

interface DatagridColumnContactProps {
  readonly contact: string;
  readonly url?: string;
}

export default function DatagridColumnContact({
  contact,
  url,
}: Readonly<DatagridColumnContactProps>) {
  if (!contact) {
    return '';
  }

  return (
    <DataGridTextCell>
      {!url ? contact : <Link href={url}>{contact}</Link>}
    </DataGridTextCell>
  );
}
