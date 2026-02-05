import React, { useMemo } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_SIZE, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button, Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { BadgeStatus, IdLink, LabelChip } from '@/components';
import { ResourceStatus } from '@/data/api';
import { useOrganizations, usePlatform } from '@/data/hooks';
import { useDebouncedValue, useGenerateUrl, useOverridePage } from '@/hooks';
import { ADD_ORGANIZATION } from '@/tracking.constants';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ActionButton from './ActionButton.component';
import { OrganizationItem } from './Organizations.types';

export default function Organizations() {
  const { t } = useTranslation(['organizations', NAMESPACES.STATUS]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();
  const isOverridedPage = useOverridePage();

  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');

  const { data, fetchAllPages, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useOrganizations({
      organizationName: debouncedSearchInput,
      refetchInterval: DATAGRID_REFRESH_INTERVAL,
      refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    });

  const items: OrganizationItem[] = useMemo(
    () =>
      data?.map((item) => ({
        id: item.id,
        name: item.currentState.name,
        label: item.currentState.label,
        account: item.currentState.accountsStatistics.reduce(
          (acc, current) => acc + current.configuredAccountsCount,
          0,
        ),
        status: item.resourceStatus,
      })) ?? [],
    [data],
  );

  const columns: DatagridColumn<OrganizationItem>[] = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        cell: ({ row, getValue }) => <IdLink id={row.original.id} label={getValue<string>()} />,
        label: 'zimbra_organization_name',
        isSearchable: true,
      },
      {
        id: 'label',
        accessorKey: 'label',
        cell: ({ row }) =>
          row.original.label && <LabelChip id={row.original.id}>{row.original.label}</LabelChip>,
        label: 'zimbra_organization_label',
      },
      {
        id: 'account',
        accessorKey: 'account',
        label: 'zimbra_organization_account_number',
      },
      {
        id: 'status',
        accessorKey: 'status',
        cell: ({ getValue }) => <BadgeStatus status={getValue<keyof typeof ResourceStatus>()} />,
        label: `${NAMESPACES.STATUS}:status`,
      },
      {
        id: 'tooltip',
        maxSize: 50,
        cell: ({ row }) => <ActionButton item={row.original} />,
        label: '',
      },
    ],
    [],
  );

  const hrefAddOrganization = useGenerateUrl('./add', 'path');

  const handleOrganizationClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ADD_ORGANIZATION],
    });
    navigate(hrefAddOrganization);
  };

  return (
    <div>
      <Outlet />
      {!isOverridedPage && (
        <Datagrid
          topbar={
            <Button
              id="add-organization-btn"
              color={BUTTON_COLOR.primary}
              size={BUTTON_SIZE.sm}
              onClick={handleOrganizationClick}
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.organization.create]}
              data-testid="add-organization-btn"
            >
              <>
                <Icon name={ICON_NAME.plus} />
                {t('common:add_organization')}
              </>
            </Button>
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
}
