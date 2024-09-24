import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { Outlet } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  Notifications,
} from '@ovh-ux/manager-react-components';

import {
  usePlatform,
  useGenerateUrl,
  useMailingLists,
  useOverridePage,
} from '@/hooks';
import ActionButtonMailingList from './ActionButtonMailingList';
import LabelChip from '@/components/LabelChip';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import { MailingListType } from '@/api/mailinglist';
import { LIST_REFRESH_INTERVAL } from '@/utils';

export type MailingListItem = {
  id: string;
  name: string;
  organizationLabel: string;
  organizationId: string;
  owner: string;
  aliases: number;
  moderators: number;
  subscribers: number;
  status: ResourceStatus;
};

const columns: DatagridColumn<MailingListItem>[] = [
  {
    id: 'domains',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {item.name}
      </OsdsText>
    ),
    label: 'zimbra_mailinglists_datagrid_name_label',
  },
  {
    id: 'organization',
    cell: (item) =>
      item.organizationLabel && (
        <LabelChip id={item.organizationId}>{item.organizationLabel}</LabelChip>
      ),
    label: 'zimbra_mailinglists_datagrid_organization_label',
  },
  {
    id: 'owner',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {item.owner}
      </OsdsText>
    ),
    label: 'zimbra_mailinglists_datagrid_owner_label',
  },
  {
    id: 'aliases',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {item.aliases}
      </OsdsText>
    ),
    label: 'zimbra_mailinglists_datagrid_aliases_label',
  },
  {
    id: 'moderators',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {item.moderators}
      </OsdsText>
    ),
    label: 'zimbra_mailinglists_datagrid_moderators_label',
  },
  {
    id: 'subscribers',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {item.subscribers}
      </OsdsText>
    ),
    label: 'zimbra_mailinglists_datagrid_subscribers_label',
  },
  {
    id: 'tooltip',
    cell: (item) =>
      (item.status === ResourceStatus.READY ||
        item.status === ResourceStatus.ERROR) && (
        <ActionButtonMailingList mailingListItem={item} />
      ),
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
    status: data?.resourceStatus as ResourceStatus,
  };
};

export const getMailingListItems = (
  data: MailingListType[],
): MailingListItem[] => {
  return data?.map(getMailingListItem) ?? [];
};

export default function MailingLists() {
  const { t } = useTranslation('mailinglists');
  const { platformId, platformUrn, data: platformData } = usePlatform();
  const { data } = useMailingLists({
    refetchInterval: LIST_REFRESH_INTERVAL,
    refetchOnMount: 'always',
  });
  const isOverriddedPage = useOverridePage();

  const items: MailingListItem[] = getMailingListItems(data);

  const hrefAddMailingList = useGenerateUrl('./add', 'href');

  // this will need to be updated
  const quota = platformData?.currentState?.quota || 0;

  return (
    <div className="py-6 mt-8">
      <Outlet />

      {!isOverriddedPage && (
        <>
          <Notifications />
          <div className="flex flex-col items-start">
            <div className="mb-8">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                hue={ODS_TEXT_COLOR_HUE._500}
                size={ODS_TEXT_SIZE._200}
                className="mr-4"
              >
                <strong>{t('zimbra_mailinglists_quota_label')}</strong>
                {` ${quota}/1000`}
              </OsdsText>
            </div>
            {platformUrn && (
              <ManagerButton
                color={ODS_THEME_COLOR_INTENT.primary}
                inline
                size={ODS_BUTTON_SIZE.sm}
                href={hrefAddMailingList}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.mailingList.create]}
                data-testid="add-mailinglist-btn"
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
                <span slot="end">{t('zimbra_mailinglists_datagrid_cta')}</span>
              </ManagerButton>
            )}
          </div>
          <Datagrid
            columns={columns.map((column) => ({
              ...column,
              label: t(column.label),
            }))}
            items={items}
            totalItems={platformId?.length || 0}
          />
        </>
      )}
    </div>
  );
}
