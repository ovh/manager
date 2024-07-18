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
} from '@ovhcloud/manager-components';
import { Outlet } from 'react-router-dom';

import {
  useOverridePage,
  useDomains,
  useGenerateUrl,
  usePlatform,
} from '@/hooks';
import ActionButtonDomain from './ActionButtonDomain';
import LabelChip from '@/components/LabelChip';

export type DomainsItem = {
  id: string;
  name: string;
  organizationLabel: string;
  account: number;
  authoritative: boolean;
  configuredAccountsCount: number;
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
        <LabelChip id={item.id}>{item.organizationLabel}</LabelChip>
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

  const { data } = useDomains();
  const isOverriddedPage = useOverridePage();

  const hrefAddDomain = useGenerateUrl('./add', 'href');

  const items: DomainsItem[] =
    data?.map((item) => ({
      name: item.targetSpec.name,
      id: item.currentState.organizationId,
      organizationLabel: item.targetSpec.organizationLabel,
      configuredAccountsCount:
        item.currentState.accountsStatistics[0].configuredAccountsCount,
      authoritative: item.currentState.authoritative,
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
            <ManagerButton
              color={ODS_THEME_COLOR_INTENT.primary}
              inline={true}
              size={ODS_BUTTON_SIZE.sm}
              href={hrefAddDomain}
              urn={platformUrn}
              iamActions={['zimbra:apiovh:platform/domain/create']}
              data-testid="add-domain-btn"
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
