import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
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
  useOrganizationList,
} from '@/hooks';
import ActionButtonDomain from './ActionButtonDomain.component';
import LabelChip from '@/components/LabelChip';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import {
  DATAGRID_REFRESH_INTERVAL,
  DATAGRID_REFRESH_ON_MOUNT,
  DnsRecordType,
  FEATURE_FLAGS,
} from '@/utils';
import Loading from '@/components/Loading/Loading';
import { DiagnosticBadge } from '@/components/DiagnosticBadge';
import { DomainType } from '@/api/domain/type';
import { AccountStatistics, ResourceStatus } from '@/api/api.type';

export type DomainsItem = {
  id: string;
  name: string;
  organizationId: string;
  organizationLabel: string;
  account: number;
  status: ResourceStatus;
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
    cell: (item) => (
      <LabelChip id={item.organizationId}>{item.organizationLabel}</LabelChip>
    ),
    label: 'zimbra_domains_datagrid_organization_label',
  },
  {
    id: 'account',
    cell: (item) => (
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
    id: 'diagnostic',
    cell: (item) => {
      return (
        <>
          <DiagnosticBadge
            diagType={DnsRecordType.MX}
            domainId={item.id}
            status="error"
          />
          <DiagnosticBadge
            diagType={DnsRecordType.SRV}
            domainId={item.id}
            status="error"
          />
          <DiagnosticBadge
            diagType={DnsRecordType.SPF}
            domainId={item.id}
            status="error"
          />
          <DiagnosticBadge
            diagType={DnsRecordType.DKIM}
            domainId={item.id}
            status="warning"
          />
        </>
      );
    },
    label: 'zimbra_domains_datagrid_diagnostic_label',
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
  const isOverridedPage = useOverridePage();

  const { data, isLoading } = useDomains({
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    enabled: !isOverridedPage,
  });

  const { data: dataOrganizations } = useOrganizationList({
    enabled: !isLoading && data?.length === 0,
  });

  const hrefAddDomain = useGenerateUrl('./add', 'href');

  const items: DomainsItem[] =
    data?.map((item: DomainType) => ({
      name: item.currentState.name,
      id: item.id,
      organizationId: item.currentState.organizationId,
      organizationLabel: item.currentState.organizationLabel,
      account: item.currentState.accountsStatistics.reduce(
        (acc: number, current: AccountStatistics) =>
          acc + current.configuredAccountsCount,
        0,
      ),
      status: item.resourceStatus,
    })) ?? [];

  return (
    <div className="py-6 mt-8">
      <Notifications />
      <Outlet />
      {platformUrn && !isOverridedPage && (
        <>
          <div className="flex items-center justify-between">
            {(data?.length > 0 || dataOrganizations?.length > 0) && (
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
            {dataOrganizations?.length === 0 && (
              <OsdsTooltip className="mb-6">
                <OsdsButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  inline
                  size={ODS_BUTTON_SIZE.sm}
                  disabled
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
                </OsdsButton>
                <OsdsTooltipContent slot="tooltip-content">
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                  >
                    {t('zimbra_domains_tooltip_need_organization')}
                  </OsdsText>
                </OsdsTooltipContent>
              </OsdsTooltip>
            )}
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <Datagrid
              columns={columns
                .filter(
                  (c) =>
                    !(
                      !FEATURE_FLAGS.DOMAIN_DIAGNOSTICS && c.id === 'diagnostic'
                    ),
                )
                .map((column) => ({
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
