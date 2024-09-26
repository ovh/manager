import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { Outlet } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { ResourceStatus } from '@/api/api.type';

import { useOrganizationList, usePlatform, useGenerateUrl } from '@/hooks';
import ActionButtonOrganization from './ActionButtonOrganization';
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
  status: string;
};

const columns: DatagridColumn<OrganizationItem>[] = [
  {
    id: 'name',
    cell: (item: OrganizationItem) => <IdLink id={item.id}>{item.name}</IdLink>,
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
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {item.account}
      </OsdsText>
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
    cell: (item: OrganizationItem) =>
      (item.status === ResourceStatus.READY ||
        item.status === ResourceStatus.ERROR) && (
        <ActionButtonOrganization organizationItem={item} />
      ),
    label: '',
  },
];

export default function Organizations() {
  const { t } = useTranslation('organizations');
  const { platformUrn } = usePlatform();
  const { data, isLoading } = useOrganizationList({
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
      status: item.resourceStatus || '',
    })) ?? [];

  const hrefAddOrganization = useGenerateUrl('./add', 'href');

  return (
    <div className="py-6 mt-8">
      <Notifications />
      <Outlet />
      {platformUrn && (
        <>
          <div className="flex items-center justify-between">
            <ManagerButton
              color={ODS_THEME_COLOR_INTENT.primary}
              inline
              size={ODS_BUTTON_SIZE.sm}
              href={hrefAddOrganization}
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.organization.create]}
              data-testid="add-organization-btn"
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
              <span slot="end">{t('zimbra_organization_cta')}</span>
            </ManagerButton>
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
