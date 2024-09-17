import React from 'react';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

export type RedirectionsItem = {
  from: string;
  to: string;
  organization: string;
};

const columns: DatagridColumn<RedirectionsItem>[] = [
  {
    id: 'from',
    cell: () => <div>toto</div>,
    label: 'zimbra_redirections_from',
  },
  {
    id: 'to',
    cell: () => <div></div>,
    label: 'zimbra_redirections_to',
  },
  {
    id: 'organization',
    cell: () => <div></div>,
    label: 'zimbra_redirections_organization',
  },
  {
    id: 'tooltip',
    cell: () => <div></div>,
    label: '',
  },
];

export default function Redirections() {
  const { t } = useTranslation('redirections');

  return (
    <Datagrid
      columns={columns.map((column) => ({
        ...column,
        label: t(column.label),
      }))}
      items={[]}
      totalItems={0}
    />
  );
}
