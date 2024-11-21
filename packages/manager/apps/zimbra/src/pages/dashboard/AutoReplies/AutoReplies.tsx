import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  Notifications,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import ActionButtonAutoReply from './ActionButtonAutoReply.component';
import { ResourceStatus } from '@/api/api.type';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

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
  const { platformUrn } = usePlatform();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const hrefAddAutoReply = useGenerateUrl('./add', 'href', params);
  const location = useLocation();

  const shouldHide = useMemo(() => location?.pathname?.endsWith('add'), [
    location,
  ]);

  return (
    <div data-testid="autoreplies" className="py-6 mt-8">
      {!editEmailAccountId && <Notifications />}
      <Outlet />
      {platformUrn && !shouldHide && (
        <>
          {editEmailAccountId && (
            <div className="mb-8">
              <Subtitle>{t('zimbra_auto_replies_account_title')}</Subtitle>
            </div>
          )}
          <ManagerButton
            color={ODS_THEME_COLOR_INTENT.primary}
            inline
            size={ODS_BUTTON_SIZE.sm}
            href={hrefAddAutoReply}
            urn={platformUrn}
            iamActions={[IAM_ACTIONS.autoReply.create]}
            data-testid="add-auto-reply-btn"
            className="mb-6"
          >
            <span slot="start">
              <OsdsIcon
                name={ODS_ICON_NAME.PLUS}
                size={ODS_ICON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
                contrasted
              ></OsdsIcon>
            </span>
            <span slot="end">{t('zimbra_auto_replies_add_cta')}</span>
          </ManagerButton>
          <Datagrid
            columns={columns.map((column) => ({
              ...column,
              label: t(column.label),
            }))}
            items={items}
            totalItems={items.length}
          />
        </>
      )}
    </div>
  );
}

export default AutoReplies;
