import {
  Datagrid,
  DatagridColumn,
  Notifications,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import ActionButtonAutoReply from './ActionButtonAutoReply.component';
import { ResourceStatus } from '@/api/api.type';

export type AutoRepliesItem = {
  id: string;
  name: string;
  from: string;
  until: string;
  copyTo: string;
  status: ResourceStatus;
};

const items: AutoRepliesItem[] = [
  {
    id: '1',
    name: 'to@example1.com',
    from: '11/02/2023',
    until: '11/02/2024',
    copyTo: 'copy@example1.com',
    status: ResourceStatus.READY,
  },
  {
    id: '2',
    name: 'to@example2.com',
    from: '11/03/2023',
    until: '11/03/2024',
    copyTo: 'copy@example2.com',
    status: ResourceStatus.ERROR,
  },
];
const columns: DatagridColumn<AutoRepliesItem>[] = [
  {
    id: 'name',
    cell: (item) => <div>{item.name}</div>,
    label: 'zimbra_auto_replies_name',
  },
  {
    id: 'from',
    cell: (item) => <div>{item.from}</div>,
    label: 'zimbra_auto_replies_from',
  },
  {
    id: 'until',
    cell: (item) => <div>{item.until}</div>,
    label: 'zimbra_auto_replies_until',
  },
  {
    id: 'copyTo',
    cell: (item) => <div>{item.copyTo}</div>,
    label: 'zimbra_auto_replies_copyTo',
  },
  {
    id: 'deleteButton',
    cell: (item) => <ActionButtonAutoReply autoReplyItem={item} />,
    label: '',
  },
];
export function AutoReplies() {
  const { t } = useTranslation('autoReplies');

  return (
    <div data-testid="autoreplies" className="py-6 mt-8">
      <Notifications />
      <Outlet />
      <Datagrid
        columns={columns.map((column) => ({
          ...column,
          label: t(column.label),
        }))}
        items={items}
        totalItems={items.length}
      />
    </div>
  );
}

export default AutoReplies;
