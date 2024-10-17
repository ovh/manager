import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsTooltip, OdsButton } from '@ovhcloud/ods-components/react';

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
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.name}</OdsText>
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
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.account}</OdsText>
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
            status="critical"
          />
          <DiagnosticBadge
            diagType={DnsRecordType.SRV}
            domainId={item.id}
            status="critical"
          />
          <DiagnosticBadge
            diagType={DnsRecordType.SPF}
            domainId={item.id}
            status="critical"
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useDomains({
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    enabled: !isOverridedPage,
  });

  const { data: dataOrganizations } = useOrganizationList({
    enabled: !isLoading && data?.length === 0,
  });

  const hrefAddDomain = useGenerateUrl('./add', 'href');

  const handleAddDomainClick = () => {
    window.location.href = hrefAddDomain;
  };

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
      <Outlet />
      {platformUrn && !isOverridedPage && (
        <>
          <div className="flex items-center justify-between">
            {(data?.length > 0 || dataOrganizations?.length > 0) && (
              <ManagerButton
                id="add-domain-btn"
                color={ODS_BUTTON_COLOR.primary}
                size={ODS_BUTTON_SIZE.sm}
                onClick={handleAddDomainClick}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.domain.create]}
                data-testid="add-domain-btn"
                className="mb-6"
                icon={ODS_ICON_NAME.plus}
                label={t('zimbra_domains_add_domain_title')}
              />
            )}
            {dataOrganizations?.length === 0 && (
              <OdsTooltip className="mb-6" triggerId="tooltip-trigger">
                <OdsButton
                  color={ODS_BUTTON_COLOR.primary}
                  size={ODS_BUTTON_SIZE.sm}
                  isDisabled
                  icon={ODS_ICON_NAME.plus}
                  label={t('zimbra_domains_add_domain_title')}
                ></OdsButton>
                <div id="tooltip-trigger">
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    {t('zimbra_domains_tooltip_need_organization')}
                  </OdsText>
                </div>
              </OdsTooltip>
            )}
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Datagrid
                columns={columns
                  .filter(
                    (c) =>
                      !(
                        !FEATURE_FLAGS.DOMAIN_DIAGNOSTICS &&
                        c.id === 'diagnostic'
                      ),
                  )
                  .map((column) => ({
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
