import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
} from '@ovh-ux/manager-react-components';
import {
  usePlatform,
  useGenerateUrl,
  useMailingLists,
  useOverridePage,
} from '@/hooks';
import ActionButtonMailingList from './ActionButtonMailingList.component';
import LabelChip from '@/components/LabelChip';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import { MailingListType } from '@/api/mailinglist';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import Loading from '@/components/Loading/Loading';
import { BadgeStatus } from '@/components/BadgeStatus';

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
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.name}</OdsText>
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
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.owner}</OdsText>
    ),
    label: 'zimbra_mailinglists_datagrid_owner_label',
  },
  {
    id: 'aliases',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.aliases}</OdsText>
    ),
    label: 'zimbra_mailinglists_datagrid_aliases_label',
  },
  {
    id: 'moderators',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.moderators}</OdsText>
    ),
    label: 'zimbra_mailinglists_datagrid_moderators_label',
  },
  {
    id: 'subscribers',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.subscribers}</OdsText>
    ),
    label: 'zimbra_mailinglists_datagrid_subscribers_label',
  },
  {
    id: 'status',
    cell: (item) => <BadgeStatus itemStatus={item.status}></BadgeStatus>,
    label: 'zimbra_mailinglists_datagrid_status_label',
  },
  {
    id: 'tooltip',
    cell: (item) => <ActionButtonMailingList mailingListItem={item} />,
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

export const getMailingListItems = (
  data: MailingListType[],
): MailingListItem[] => {
  return data?.map(getMailingListItem) ?? [];
};

export default function MailingLists() {
  const { t } = useTranslation('mailinglists');
  const navigate = useNavigate();
  const { platformUrn, data: platformData } = usePlatform();
  const { data, isLoading } = useMailingLists({
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });
  const isOverridedPage = useOverridePage();

  const items: MailingListItem[] = getMailingListItems(data);

  const hrefAddMailingList = useGenerateUrl('./add', 'path');

  const handleAddMailingListClick = () => {
    navigate(hrefAddMailingList);
  };
  // this will need to be updated
  const quota = platformData?.currentState?.quota || 0;

  return (
    <div className="py-6">
      <Outlet />
      {platformUrn && !isOverridedPage && (
        <>
          <div className="flex flex-col items-start">
            <div className="mb-8">
              <OdsText
                preset={ODS_TEXT_PRESET.paragraph}
                className="mr-4 font-bold"
              >
                <strong>{t('zimbra_mailinglists_quota_label')}</strong>
                {` ${quota}/1000`}
              </OdsText>
            </div>
            <ManagerButton
              id="add-mailinglist-btn"
              color={ODS_BUTTON_COLOR.primary}
              inline-block
              size={ODS_BUTTON_SIZE.sm}
              onClick={handleAddMailingListClick}
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.mailingList.create]}
              data-testid="add-mailinglist-btn"
              className="mb-6"
              icon={ODS_ICON_NAME.plus}
              label={t('zimbra_mailinglists_datagrid_cta')}
            />
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <Datagrid
              columns={columns.map((column) => ({
                ...column,
                label: t(column.label),
              }))}
              items={items}
              totalItems={items.length}
            />
          )}
        </>
      )}
    </div>
  );
}
