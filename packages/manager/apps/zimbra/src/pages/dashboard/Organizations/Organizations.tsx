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
import { ResourceStatus } from '@/api/api.type';

import { useOrganizationList, usePlatform, useGenerateUrl } from '@/hooks';
import ActionButtonOrganization from './ActionButtonOrganization.component';
import IdLink from './IdLink';
import LabelChip from '@/components/LabelChip';
import { BadgeStatus } from '@/components/BadgeStatus';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import Loading from '@/components/Loading/Loading';

export type OrganizationItem = {
  id: string;
  name: string;
  label: string;
  account: number;
  status: ResourceStatus;
};

const columns: DatagridColumn<OrganizationItem>[] = [
  {
    id: 'name',
    cell: (item: OrganizationItem) => <IdLink id={item.id} label={item.name} />,
    label: 'zimbra_organization_name',
  },
  {
    id: 'label',
    cell: (item: OrganizationItem) =>
      item.label && <LabelChip id={item.id}>{item.label}</LabelChip>,
    label: 'zimbra_organization_label',
  },
  {
    id: 'account',
    cell: (item: OrganizationItem) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.account}</OdsText>
    ),
    label: 'zimbra_organization_account_number',
  },
  {
    id: 'status',
    cell: (item: OrganizationItem) => (
      <BadgeStatus itemStatus={item.status}></BadgeStatus>
    ),
    label: 'zimbra_organization_status',
  },
  {
    id: 'tooltip',
    cell: (item: OrganizationItem) => (
      <ActionButtonOrganization organizationItem={item} />
    ),
    label: '',
  },
];

export default function Organizations() {
  const { t } = useTranslation('organizations');
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useOrganizationList({
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });

  const items: OrganizationItem[] =
    data?.map((item) => ({
      id: item.id,
      name: item.currentState.name,
      label: item.currentState.label,
      account: item.currentState.accountsStatistics.reduce(
        (acc, current) => acc + current.configuredAccountsCount,
        0,
      ),
      status: item.resourceStatus,
    })) ?? [];

  const hrefAddOrganization = useGenerateUrl('./add', 'path');

  const handleOrganizationClick = () => {
    navigate(hrefAddOrganization);
  };

  return (
    <div>
      <Outlet />
      {platformUrn && (
        <>
          <div className="flex items-center justify-between">
            <ManagerButton
              id="add-organization-btn"
              color={ODS_BUTTON_COLOR.primary}
              inline-block
              size={ODS_BUTTON_SIZE.sm}
              onClick={handleOrganizationClick}
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.organization.create]}
              data-testid="add-organization-btn"
              className="mb-6"
              icon={ODS_ICON_NAME.plus}
              label={t('zimbra_organization_cta')}
            />
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Datagrid
                columns={columns.map((column) => ({
                  ...column,
                  label: t(column.label),
                }))}
                items={items}
                totalItems={items.length}
                hasNextPage={!isFetchingNextPage && hasNextPage}
                onFetchNextPage={fetchNextPage}
              />
              {isFetchingNextPage && <Loading />}
            </>
          )}
        </>
      )}
    </div>
  );
}
