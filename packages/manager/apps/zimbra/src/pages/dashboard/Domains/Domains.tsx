import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
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
import { Outlet } from 'react-router-dom';

import {
  useOverridePage,
  useDomains,
  useGenerateUrl,
  usePlatform,
} from '@/hooks';
import ActionButtonDomain from './ActionButtonDomain';
import LabelChip from '@/components/LabelChip';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';

export type DomainsItem = {
  id: string;
  name: string;
  organizationId: string;
  organizationLabel: string;
  account: number;
};

const columns: DatagridColumn<DomainsItem>[] = [
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
    label: 'zimbra_domains_datagrid_domain_label',
  },
  {
    id: 'organization',
    cell: (item) =>
      item.organizationLabel && (
        <LabelChip id={item.organizationId}>{item.organizationLabel}</LabelChip>
      ),
    label: 'zimbra_domains_datagrid_organization_label',
  },
  {
    id: 'account',
    cell: (item) =>
      item.account && (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
        >
          {item.account}
        </OsdsText>
      ),
    label: 'zimbra_domains_datagrid_account_number',
  },
  {
    id: 'tooltip',
    cell: (item: DomainsItem) => <ActionButtonDomain domainItem={item} />,
    label: '',
  },
];

export default function Domains() {
  const { t } = useTranslation('domains');
  const { platformUrn } = usePlatform();

  const { data } = useDomains({
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });

  const isOverriddedPage = useOverridePage();

  const hrefAddDomain = useGenerateUrl('./add', 'href');

  const items: DomainsItem[] =
    data?.map((item) => ({
      name: item.currentState.name,
      id: item.id,
      organizationId: item.currentState.organizationId,
      organizationLabel: item.currentState.organizationLabel,
      account: item.currentState.accountsStatistics.reduce(
        (acc, current) => acc + current.configuredAccountsCount,
        0,
      ),
    })) ?? [];

  return (
    <>
      {!isOverriddedPage && (
        <div className="py-6 mt-8">
          <Notifications />
          <div className="flex items-center justify-between">
            {platformUrn && (
              <ManagerButton
                color={ODS_THEME_COLOR_INTENT.primary}
                inline
                size={ODS_BUTTON_SIZE.sm}
                href={hrefAddDomain}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.domain.create]}
                data-testid="add-domain-btn"
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
                <span slot="end">{t('zimbra_domains_add_domain_title')}</span>
              </ManagerButton>
            )}
          </div>
          <Datagrid
            columns={columns.map((column) => ({
              ...column,
              label: t(column.label),
            }))}
            items={items}
            totalItems={items.length}
          />
        </div>
      )}
      <Outlet />
    </>
  );
}
