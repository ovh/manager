import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import ActionButtonAutoReply from './ActionButtonAutoReply.component';
import { ResourceStatus } from '@/api/api.type';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { BadgeStatus } from '@/components/BadgeStatus';

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
    id: 'status',
    cell: (item) => <BadgeStatus itemStatus={item.status}></BadgeStatus>,
    label: 'zimbra_auto_replies_status',
  },
  {
    id: 'actions',
    cell: (item) => <ActionButtonAutoReply autoReplyItem={item} />,
    label: '',
  },
];

export function AutoReplies() {
  const { t } = useTranslation('autoReplies');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const hrefAddAutoReply = useGenerateUrl('./add', 'href', params);
  const handleAddClick = () => navigate(hrefAddAutoReply);
  const location = useLocation();

  const shouldHide = useMemo(() => location?.pathname?.endsWith('add'), [
    location,
  ]);

  return (
    <div data-testid="autoreplies">
      <Outlet />
      {platformUrn && !shouldHide && (
        <>
          {editEmailAccountId && (
            <div className="mb-8">
              <Subtitle>{t('zimbra_auto_replies_account_title')}</Subtitle>
            </div>
          )}
          <ManagerButton
            id="add-auto-reply-btn"
            data-testid="add-auto-reply-btn"
            color={ODS_BUTTON_COLOR.primary}
            size={ODS_BUTTON_SIZE.sm}
            onClick={handleAddClick}
            urn={platformUrn}
            iamActions={[IAM_ACTIONS.autoReply.create]}
            icon={ODS_ICON_NAME.plus}
            label={t('zimbra_auto_replies_add_cta')}
            className="mb-6"
          ></ManagerButton>
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
