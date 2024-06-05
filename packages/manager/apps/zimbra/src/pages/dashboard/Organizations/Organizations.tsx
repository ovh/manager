import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
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
  Notifications,
} from '@ovhcloud/manager-components';
import { ResourceStatus } from '@/api/api.type';

import { useOrganizationList, usePlatform } from '@/hooks';
import { ActionButtonOrganization } from './ActionButtonOrganization';
import IdLink from './IdLink';
import LabelChip from '@/components/LabelChip';
import { BadgeStatus } from '@/components/BadgeStatus';

export type OrganizationItem = {
  id: string;
  name: string;
  label: string;
  account: string;
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
        size={ODS_TEXT_SIZE._200}
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
  const { t } = useTranslation('organisations');
  const { platformId } = usePlatform();
  const { data } = useOrganizationList();

  const items: OrganizationItem[] =
    data?.map((item) => ({
      id: item.id,
      name: item.targetSpec.name,
      label: item.targetSpec.label,
      account:
        item.targetSpec.accountsStatistics[0]?.configuredAccountsCount?.toString() ||
        '',
      status: item.resourceStatus || '',
    })) ?? [];

  const handleAddOrganisation = () => {
    console.log('Ajouter une nouvelle organisation');
  };

  return (
    <div className="py-6 mt-8">
      <Notifications />
      <Outlet />
      <div className="flex items-center justify-between">
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          inline={true}
          size={ODS_BUTTON_SIZE.sm}
          onClick={handleAddOrganisation}
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
        </OsdsButton>
      </div>
      <Datagrid
        columns={columns.map((column) => ({
          ...column,
          label: t(column.label),
        }))}
        items={items}
        totalItems={platformId?.length || 0}
      />
    </div>
  );
}
