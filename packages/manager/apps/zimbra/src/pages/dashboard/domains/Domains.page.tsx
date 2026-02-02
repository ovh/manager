import React, { useMemo } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button, Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { BadgeStatus } from '@/components';
import { AccountStatistics, DomainType, ResourceStatus } from '@/data/api';
import { useDomains, useOrganizations, usePlatform } from '@/data/hooks';
import { useDebouncedValue, useGenerateUrl, useOverridePage } from '@/hooks';
import { ADD_DOMAIN } from '@/tracking.constants';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ActionButtonDomain from './ActionButton.component';
import { CnameBadge } from './CnameBadge.component';
import { DomainItem } from './Domains.types';

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

  const columns: DatagridColumn<DomainItem>[] = useMemo(
    () => [
      {
        id: 'domains',
        accessorKey: 'name',
        label: 'common:domain',
        isSearchable: true,
      },
      {
        id: 'organization',
        accessorKey: 'organizationLabel',
        label: 'common:organization',
        isSearchable: true,
      },
      {
        id: 'account',
        accessorKey: 'name',
        label: 'common:number_of_accounts',
      },
      {
        id: 'status',
        accessorKey: 'name',
        cell: ({ row }) =>
          row.original.cnameToCheck && row.original.status === ResourceStatus.CREATING ? (
            <CnameBadge item={row.original} />
          ) : (
            <BadgeStatus status={row.original.status}></BadgeStatus>
          ),
        label: `${NAMESPACES.STATUS}:status`,
      },
      {
        id: 'tooltip',
        maxSize: 50,
        accessorKey: '',
        cell: ({ row }) => <ActionButtonDomain item={row.original} />,
        label: '',
      },
    ],
    [organizations],
  );

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
    <div className="h-full">
      <Outlet />
      {!isOverridedPage && (
        <Datagrid
          containerHeight={0}
          topbar={
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    id="add-domain-btn"
                    color={BUTTON_COLOR.primary}
                    size={BUTTON_SIZE.sm}
                    onClick={handleAddDomainClick}
                    urn={platformUrn}
                    iamActions={[IAM_ACTIONS.domain.create]}
                    data-testid="add-domain-btn"
                    disabled={organizations?.length === 0}
                  >
                    <>
                      <Icon name={ICON_NAME.plus} />
                      {t('common:add_domain')}
                    </>
                  </Button>
                </TooltipTrigger>
                {(isLoading || organizations?.length === 0) && (
                  <TooltipContent>
                    <Text preset={TEXT_PRESET.paragraph}>
                      {t('zimbra_domains_tooltip_need_organization')}
                    </Text>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          }
          search={{
            searchInput,
            setSearchInput,
            onSearch: (search) => setDebouncedSearchInput(search),
          }}
          columns={columns.map((column) => ({
            ...column,
            header: t(column.label),
          }))}
          data={items}
          totalCount={items.length}
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
