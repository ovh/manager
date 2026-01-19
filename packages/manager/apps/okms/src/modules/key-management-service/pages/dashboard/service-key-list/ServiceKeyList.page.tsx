import { useState } from 'react';

import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';

import {
  DatagridCellType,
  DatagridCreationDate,
  DatagridServiceKeyActionMenu,
  DatagridServiceKeyCellId,
  DatagridServiceKeyCellName,
  DatagridStatus,
} from '@key-management-service/components/listing/ListingCells';
import { getOkmsServiceKeyResourceListQueryKey } from '@key-management-service/data/api/okmsServiceKey';
import { KmsDashboardOutletContext } from '@key-management-service/pages/dashboard/KmsDashboard.type';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';
import { RowSelectionState, VisibilityState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { FilterComparator } from '@ovh-ux/manager-core-api';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Button, Datagrid, Icon } from '@ovh-ux/muk';
import { DatagridColumn, useDataApi } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';

import { SERVICE_KEY_LIST_TEST_IDS } from './ServiceKeyList.constants';

/* NOTES

ISSUES/QUESTIONS

style
- container height is limiting
- we always have to scroll to see the last row
- filter dropdown width is too narrow, and width changes when selecting an option.

sorting
- sorting by creation date is not working => iceberg issue (SU.dev pplatfrom)
- when sorting, the pagination is reset -> expected behavior 
- isSortable false is not working -> create Github issue

actions
- action dropdwon is hidden (z-index issue?) => ODS side

column visibility
- warning with column visibility state
- column visibility labels are not working

search
- can't set placeholder for search input

others
- can the useDataApi hook exposed a refetch function ?
*/

export default function Keys() {
  const { t } = useTranslation(['key-management-service/serviceKeys']);
  const { okmsId } = useRequiredParams('okmsId');
  const { okms } = useOutletContext<KmsDashboardOutletContext>();
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  console.log('rowSelection', rowSelection);

  // Improved handleReload with loading state
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await queryClient.refetchQueries({
        queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
      });
    } finally {
      // artificial delay to simulate loading state and notify the user.
      setTimeout(() => {
        setIsReloading(false);
      }, 400);
    }
  };

  const columns: DatagridColumn<OkmsServiceKey>[] = [
    {
      id: 'name',
      accessorKey: 'name' as const,
      cell: ({ row }: { row: { original: OkmsServiceKey } }) =>
        DatagridServiceKeyCellName(row.original),
      label: t('key_management_service_service-keys_column_name'),
      isSortable: true,
      isSearchable: true,
      enableHiding: false,
    },
    {
      id: 'id',
      accessorKey: 'id',
      cell: ({ row }: { row: { original: OkmsServiceKey } }) =>
        DatagridServiceKeyCellId(row.original),
      label: t('key_management_service_service-keys_column_id'),
      isSortable: false, // not working
    },
    {
      id: 'type',
      accessorKey: 'type',
      cell: ({ row }: { row: { original: OkmsServiceKey } }) => DatagridCellType(row.original),
      label: t('key_management_service_service-keys_column_type'),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
      comparator: [FilterComparator.IsEqual],
      filterOptions: [
        {
          label: t('key_management_service_service-keys_dashboard_field_type_EC'),
          value: 'EC',
        },
        {
          label: t('key_management_service_service-keys_dashboard_field_type_RSA'),
          value: 'RSA',
        },
        {
          label: t('key_management_service_service-keys_dashboard_field_type_oct'),
          value: 'oct',
        },
      ],
    },
    {
      id: 'creation_date',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: { original: OkmsServiceKey } }) => DatagridCreationDate(row.original),
      label: t('key_management_service_service-keys_column_created-at'),
      isSortable: true,
      enableHiding: true,
      type: FilterTypeCategories.Date,
    },
    {
      id: 'state',
      accessorKey: 'state',
      cell: ({ row }: { row: { original: OkmsServiceKey } }) => DatagridStatus(row.original),
      label: t('key_management_service_service-keys_column_state'),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
      comparator: [FilterComparator.IsEqual],
      filterOptions: [
        {
          label: t('key_management_service_service-keys_dashboard_field_state_active'),
          value: 'ACTIVE',
        },
        {
          label: t('key_management_service_service-keys_dashboard_field_state_compromised'),
          value: 'COMPROMISED',
        },
        {
          label: t('key_management_service_service-keys_dashboard_field_state_deactivated'),
          value: 'DEACTIVATED',
        },
        {
          label: t('key_management_service_service-keys_dashboard_field_state_destroyed'),
          value: 'DESTROYED',
        },
        {
          label: t(
            'key_management_service_service-keys_dashboard_field_state_destroyed_compromised',
          ),
          value: 'DESTROYED_COMPROMISED',
        },
        {
          label: t('key_management_service_service-keys_dashboard_field_state_pre_active'),
          value: 'PRE_ACTIVE',
        },
      ],
    },
    {
      id: 'action',
      cell: ({ row }: { row: { original: OkmsServiceKey } }) =>
        DatagridServiceKeyActionMenu(row.original, okms),
      isFilterable: false,
      size: 60,
    },
  ];

  const {
    flattenData,
    isError,
    isLoading,
    sorting,
    totalCount,
    error,
    hasNextPage,
    filters,
    fetchNextPage,
    search,
  } = useDataApi<OkmsServiceKey>({
    route: `/okms/resource/${okmsId}/serviceKey`,
    version: 'v2',
    iceberg: true,
    pageSize: 5,
    cacheKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
    defaultSorting: [{ id: 'name', desc: false }],
    // fetchAll: true,
    columns,
    disableCache: true,
    enabled: true,
  });

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <>
      <div>
        <Datagrid
          topbar={
            <div className="flex justify-between gap-2">
              <Button
                id="createEncryptionKey"
                data-testid={SERVICE_KEY_LIST_TEST_IDS.ctaCreateKey}
                color="primary"
                size="sm"
                className="w-fit"
                onClick={() => {
                  trackClick({
                    location: PageLocation.page,
                    buttonType: ButtonType.button,
                    actionType: 'action',
                    actions: ['create', 'service-key'],
                  });
                  navigate(KMS_ROUTES_URLS.serviceKeyCreate(okmsId));
                }}
                urn={okms.iam.urn}
                iamActions={[kmsIamActions.serviceKeyCreate]}
              >
                {t('key_management_service_service-keys_cta_create')}
              </Button>
              <Button size="sm" variant="outline" onClick={handleReload} loading={isReloading}>
                <Icon name="refresh" />
              </Button>
            </div>
          }
          columns={columns}
          data={flattenData ?? []}
          totalCount={totalCount}
          sorting={sorting}
          filters={filters}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
          search={search}
          columnVisibility={{
            columnVisibility,
            setColumnVisibility,
          }}
          rowSelection={{
            rowSelection,
            setRowSelection,
          }}
        />
        <Outlet />
      </div>
    </>
  );
}
