import React from 'react';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import ActionButtonRedirections from './ActionButtonRedirections.component';

export type RedirectionsItem = {
  id: any;
  from: string;
  to: string;
  organization: string;
};

const items: RedirectionsItem[] = [
  {
    from: 'from@example.com',
    to: 'to@example.com',
    organization: 'Test Organization',
    id: 1,
  },
];

const columns: DatagridColumn<RedirectionsItem>[] = [
  {
    id: 'from',
    cell: (item) => <div>{item.from}</div>,
    label: 'zimbra_redirections_from',
  },
  {
    id: 'to',
    cell: (item) => <div>{item.to}</div>,
    label: 'zimbra_redirections_to',
  },
  {
    id: 'organization',
    cell: (item) => <div>{item.organization}</div>,
    label: 'zimbra_redirections_organization',
  },
  {
    id: 'tooltip',
    cell: () => (
      <ActionButtonRedirections
        data-testid="add-redirections-btn"
        redirectionsItem={{
          id: undefined,
          from: '',
          to: '',
          organization: '',
        }}
      />
    ),
    label: '',
  },
];

export function Redirections() {
  const { t } = useTranslation('redirections');

  return (
    <>
      <Outlet />
      <Datagrid
        columns={columns.map((column) => ({
          ...column,
          label: t(column.label),
        }))}
        items={items}
        totalItems={0}
      />
    </>
  );
}

export default Redirections;
