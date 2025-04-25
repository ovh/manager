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
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import ActionButtonAutoReply from './ActionButtonAutoReply.component';
import { ResourceStatus } from '@/api/api.type';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { BadgeStatus } from '@/components/BadgeStatus';
import {
  ADD_AUTO_REPLY,
  EMAIL_ACCOUNT_ADD_AUTO_REPLY,
} from '@/tracking.constant';

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
    label: 'common:from',
  },
  {
    id: 'until',
    cell: (item) => <div>{item.until}</div>,
    label: 'common:until',
  },
  {
    id: 'copyTo',
    cell: (item) => <div>{item.copyTo}</div>,
    label: 'zimbra_auto_replies_copyTo',
  },
  {
    id: 'status',
    cell: (item) => <BadgeStatus itemStatus={item.status}></BadgeStatus>,
    label: 'common:status',
  },
  {
    id: 'actions',
    cell: (item) => <ActionButtonAutoReply autoReplyItem={item} />,
    label: '',
  },
];

export function AutoReplies() {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['auto-replies', 'common']);
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId } = useParams();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const hrefAddAutoReply = useGenerateUrl('./add', 'href', params);
  const handleAddClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [accountId ? EMAIL_ACCOUNT_ADD_AUTO_REPLY : ADD_AUTO_REPLY],
    });

    navigate(hrefAddAutoReply);
  };

  const shouldHide = useMemo(() => location?.pathname?.endsWith('add'), [
    location,
  ]);

  return (
    <div data-testid="autoreplies">
      <Outlet />
      {platformUrn && !shouldHide && (
        <>
          {accountId && (
            <div className="mb-6">
              <Subtitle>{t('zimbra_auto_replies_account_title')}</Subtitle>
            </div>
          )}
          <Datagrid
            topbar={
              <ManagerButton
                id="add-auto-reply-btn"
                data-testid="add-auto-reply-btn"
                color={ODS_BUTTON_COLOR.primary}
                size={ODS_BUTTON_SIZE.sm}
                onClick={handleAddClick}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.autoReply.create]}
                icon={ODS_ICON_NAME.plus}
                label={t('common:add_auto_reply')}
              />
            }
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
