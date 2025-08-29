import React from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, DatagridColumn, ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BadgeStatus, LabelChip } from '@/components';
import { MailingListType } from '@/data/api';
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
    cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.name}</OdsText>,
    label: 'common:mailing_list',
  },
  {
    id: 'organization',
    cell: (item) =>
      item.organizationLabel && (
        <LabelChip id={item.organizationId}>{item.organizationLabel}</LabelChip>
      ),
    label: 'common:organization',
  },
  {
    id: 'owner',
    cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.owner}</OdsText>,
    label: 'common:owner',
  },
  {
    id: 'alias',
    cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.aliases}</OdsText>,
    label: 'common:alias',
  },
  {
    id: 'moderators',
    cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.moderators}</OdsText>,
    label: 'zimbra_mailinglists_datagrid_moderators_label',
  },
  {
    id: 'subscribers',
    cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.subscribers}</OdsText>,
    label: 'zimbra_mailinglists_datagrid_subscribers_label',
  },
  {
    id: 'status',
    cell: (item) => <BadgeStatus status={item.status}></BadgeStatus>,
    label: `${NAMESPACES.STATUS}:status`,
  },
  {
    id: 'tooltip',
    cell: (item) => <ActionButtonMailingList item={item} />,
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
          <div className="flex flex-col items-start mb-6">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              <OdsText preset={ODS_TEXT_PRESET.heading6} className="mr-4">
                {t('zimbra_mailinglists_quota_label')}
                {' :'}
              </OdsText>
              {`${quota} / 1000`}
            </OdsText>
          </div>
          <Datagrid
            topbar={
              <ManagerButton
                id="add-mailinglist-btn"
                color={ODS_BUTTON_COLOR.primary}
                inline-block
                size={ODS_BUTTON_SIZE.sm}
                onClick={handleAddMailingListClick}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.mailingList.create]}
                data-testid="add-mailinglist-btn"
                icon={ODS_ICON_NAME.plus}
                label={t('common:add_mailing_list')}
              />
            }
            columns={columns.map((column) => ({
              ...column,
              label: t(column.label),
            }))}
            items={items}
            totalItems={items.length}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default MailingLists;
