import React, { useMemo } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, DatagridColumn, ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BadgeStatus, LabelChip } from '@/components';
import { AccountStatistics, DomainType, ResourceStatus } from '@/data/api';
import { useDomains, useOrganizations, usePlatform } from '@/data/hooks';
import { useDebouncedValue, useGenerateUrl, useOverridePage } from '@/hooks';
import { ADD_DOMAIN } from '@/tracking.constants';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ActionButtonDomain from './ActionButton.component';
import { CnameBadge } from './CnameBadge.component';
import { DomainItem } from './Domains.types';

const columns: DatagridColumn<DomainItem>[] = [
  {
    id: 'domains',
    cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.name}</OdsText>,
    label: 'common:domain',
    isSearchable: true,
  },
  {
    id: 'organization',
    cell: (item) => <LabelChip id={item.organizationId}>{item.organizationLabel}</LabelChip>,
    label: 'common:organization',
  },
  {
    id: 'account',
    cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.account}</OdsText>,
    label: 'common:number_of_accounts',
  },
  {
    id: 'status',
    cell: (item) =>
      item.cnameToCheck && item.status === ResourceStatus.CREATING ? (
        <CnameBadge item={item} />
      ) : (
        <BadgeStatus status={item.status}></BadgeStatus>
      ),
    label: `${NAMESPACES.STATUS}:status`,
  },
  {
    id: 'tooltip',
    cell: (item: DomainItem) => <ActionButtonDomain item={item} />,
    label: '',
  },
];

export const Domains = () => {
  const { t } = useTranslation(['domains', 'common', NAMESPACES.STATUS]);
  const { trackClick } = useOvhTracking();
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();
  const isOverridedPage = useOverridePage();

  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');

  const {
    data: domains,
    fetchAllPages,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useDomains({
    domainName: debouncedSearchInput,
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    enabled: !isOverridedPage,
  });

  const { data: organizations } = useOrganizations({
    enabled: !isOverridedPage,
  });

  const hrefAddDomain = useGenerateUrl('./add', 'path');

  const handleAddDomainClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ADD_DOMAIN],
    });
    navigate(hrefAddDomain);
  };

  const items: DomainItem[] = useMemo(() => {
    return (
      domains?.map((item: DomainType) => ({
        name: item.currentState?.name,
        id: item.id,
        organizationId: item.currentState?.organizationId,
        organizationLabel: item.currentState?.organizationLabel,
        account: item.currentState?.accountsStatistics.reduce(
          (acc: number, current: AccountStatistics) => acc + current.configuredAccountsCount,
          0,
        ),
        status: item.resourceStatus,
        cnameToCheck: item.currentState?.expectedDNSConfig?.ownership?.cname,
      })) ?? []
    );
  }, [domains]);

  return (
    <div>
      <Outlet />
      {!isOverridedPage && (
        <Datagrid
          topbar={
            <div className="flex items-center justify-between">
              <div id="tooltip-trigger-domain-btn">
                <ManagerButton
                  id="add-domain-btn"
                  color={ODS_BUTTON_COLOR.primary}
                  size={ODS_BUTTON_SIZE.sm}
                  onClick={handleAddDomainClick}
                  urn={platformUrn}
                  iamActions={[IAM_ACTIONS.domain.create]}
                  data-testid="add-domain-btn"
                  isDisabled={organizations?.length === 0}
                  icon={ODS_ICON_NAME.plus}
                  label={t('common:add_domain')}
                />
              </div>
              {(isLoading || organizations?.length === 0) && (
                <OdsTooltip role="tooltip" triggerId={'tooltip-trigger-domain-btn'}>
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    {t('zimbra_domains_tooltip_need_organization')}
                  </OdsText>
                </OdsTooltip>
              )}
            </div>
          }
          search={{
            searchInput,
            setSearchInput,
            onSearch: (search) => setDebouncedSearchInput(search),
          }}
          columns={columns.map((column) => ({
            ...column,
            label: t(column.label),
          }))}
          items={items}
          totalItems={items.length}
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
          onFetchAllPages={fetchAllPages}
          isLoading={isLoading || isFetchingNextPage}
        />
      )}
    </div>
  );
};

export default Domains;
