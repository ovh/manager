import React from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_SIZE, ICON_NAME, Icon, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button, Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { BadgeStatus, LabelChip } from '@/components';
import { MailingListType, ResourceStatus } from '@/data/api';
import { useMailingLists, usePlatform } from '@/data/hooks';
import { useGenerateUrl, useOverridePage } from '@/hooks';
import { ADD_MAILING_LIST } from '@/tracking.constants';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ActionButtonMailingList from './ActionButton.component';
import { MailingListItem } from './MailingLists.types';

const columns: DatagridColumn<MailingListItem>[] = [
  {
    id: 'domains',
    accessorKey: 'name',
    label: 'common:mailing_list',
  },
  {
    id: 'organization',
    accessorKey: 'organizationLabel',
    cell: ({ getValue }) => <LabelChip id={getValue<string>()}>{getValue<string>()}</LabelChip>,
    label: 'common:organization',
  },
  {
    id: 'owner',
    accessorKey: 'owner',
    label: 'common:owner',
  },
  {
    id: 'alias',
    accessorKey: 'aliases',
    label: 'common:alias',
  },
  {
    id: 'moderators',
    accessorKey: 'moderators',
    label: 'zimbra_mailinglists_datagrid_moderators_label',
  },
  {
    id: 'subscribers',
    accessorKey: 'subscribers',
    label: 'zimbra_mailinglists_datagrid_subscribers_label',
  },
  {
    id: 'status',
    accessorKey: 'status',
    cell: ({ getValue }) => (
      <BadgeStatus status={getValue<keyof typeof ResourceStatus>()}></BadgeStatus>
    ),
    label: `${NAMESPACES.STATUS}:status`,
  },
  {
    id: 'tooltip',
    maxSize: 50,
    cell: ({ row }) => <ActionButtonMailingList item={row.original} />,
    label: '',
  },
];

export const getMailingListItem = (data: MailingListType): MailingListItem => {
  return {
    id: data?.id,
    name: data?.currentState?.email,
    organizationLabel: data?.currentState?.organizationLabel,
    organizationId: data?.currentState?.organizationId,
    owner: data?.currentState?.owner,
    aliases: 0,
    moderators: 0,
    subscribers: data?.currentState?.members?.length || 0,
    status: data?.resourceStatus,
  };
};

export const getMailingListItems = (data: MailingListType[]): MailingListItem[] => {
  return data?.map(getMailingListItem) ?? [];
};

export const MailingLists = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['mailing-lists', NAMESPACES.STATUS]);
  const navigate = useNavigate();
  const { platformUrn, data: platformData } = usePlatform();
  const isOverridedPage = useOverridePage();
  const { data, isLoading } = useMailingLists({
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    enabled: !isOverridedPage,
  });

  const items: MailingListItem[] = getMailingListItems(data);

  const hrefAddMailingList = useGenerateUrl('./add', 'path');

  const handleAddMailingListClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ADD_MAILING_LIST],
    });
    navigate(hrefAddMailingList);
  };
  // this will need to be updated
  const quota = platformData?.currentState?.quota || 0;

  return (
    <div>
      <Outlet />
      {!isOverridedPage && (
        <>
          <div className="mb-6 flex flex-col items-start">
            <Text preset={TEXT_PRESET.paragraph}>
              <Text preset={TEXT_PRESET.heading6} className="mr-4">
                {t('zimbra_mailinglists_quota_label')}
                {' :'}
              </Text>
              {`${quota} / 1000`}
            </Text>
          </div>
          <Datagrid
            topbar={
              <Button
                id="add-mailinglist-btn"
                color={BUTTON_COLOR.primary}
                size={BUTTON_SIZE.sm}
                onClick={handleAddMailingListClick}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.mailingList.create]}
                data-testid="add-mailinglist-btn"
              >
                <>
                  <Icon name={ICON_NAME.plus} />
                  {t('common:add_mailing_list')}
                </>
              </Button>
            }
            columns={columns.map((column) => ({
              ...column,
              header: t(column.label),
            }))}
            data={items}
            totalCount={items.length}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default MailingLists;
