import React, { useMemo } from 'react';

import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_SIZE, ICON_NAME, Icon, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button, Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { BadgeStatus } from '@/components';
import { ResourceStatus } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { ADD_AUTO_REPLY, EMAIL_ACCOUNT_ADD_AUTO_REPLY } from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ActionButtonAutoReply from './ActionButton.component';
import { AutoReplyItem } from './AutoReplies.types';

const items: AutoReplyItem[] = [
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
const columns: DatagridColumn<AutoReplyItem>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    label: 'zimbra_auto_replies_name',
  },
  {
    id: 'from',
    accessorKey: 'form',
    label: 'common:from',
  },
  {
    id: 'until',
    accessorKey: 'until',
    label: 'common:until',
  },
  {
    id: 'copyTo',
    accessorKey: 'copyTo',
    label: 'zimbra_auto_replies_copyTo',
  },
  {
    id: 'status',
    accessorKey: 'status',
    cell: ({ row }) => <BadgeStatus status={row.original.status}></BadgeStatus>,
    label: `${NAMESPACES.STATUS}:status`,
  },
  {
    id: 'actions',
    maxSize: 50,
    accessorKey: 'actions',
    cell: ({ row }) => <ActionButtonAutoReply item={row.original} />,
    label: '',
  },
];

export const AutoReplies = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['auto-replies', 'common', NAMESPACES.ACTIONS, NAMESPACES.STATUS]);
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

  const shouldHide = useMemo(() => location?.pathname?.endsWith('add'), [location]);

  return (
    <div data-testid="autoreplies">
      <Outlet />
      {!shouldHide && (
        <>
          {accountId && (
            <div className="mb-6">
              <Text preset={TEXT_PRESET.heading3}>{t('zimbra_auto_replies_account_title')}</Text>
            </div>
          )}
          <Datagrid
            topbar={
              <Button
                id="add-auto-reply-btn"
                data-testid="add-auto-reply-btn"
                color={BUTTON_COLOR.primary}
                size={BUTTON_SIZE.sm}
                onClick={handleAddClick}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.autoReply.create]}
              >
                <>
                  <Icon name={ICON_NAME.plus} />
                  {t('common:add_auto_reply')}
                </>
              </Button>
            }
            columns={columns.map((column) => ({
              ...column,
              header: t(column.label),
            }))}
            data={items}
            totalCount={items.length}
          />
        </>
      )}
    </div>
  );
};

export default AutoReplies;
