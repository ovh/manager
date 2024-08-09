import {
  Datagrid,
  DatagridColumn,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

export type AutoRepliesItem = {
  id: string;
  name: string;
  from: string;
  until: string;
  copyTo: string;
};

const items: AutoRepliesItem[] = [
  {
    id: '1',
    name: 'to@example1.com',
    from: '11/02/2023',
    until: '11/02/2024',
    copyTo: 'copy@example1.com',
  },
  {
    id: '2',
    name: 'to@example2.com',
    from: '11/03/2023',
    until: '11/03/2024',
    copyTo: 'copy@example2.com',
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
    cell: () => (
      <>
        <OsdsButton
          inline
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.BIN}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
        </OsdsButton>
      </>
    ),
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
