import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
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
      {!url ? (
        contact
      ) : (
        <OdsLink href={url} label={contact} class="link-banner" />
      )}
    </DataGridTextCell>
  );
}
