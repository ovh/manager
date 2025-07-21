import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Outlet } from 'react-router-dom';
import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  BaseLayout,
  DatagridColumn,
  RedirectionGuard,
  ChangelogButton,
  HeadersProps,
  useColumnFilters,
} from '@ovh-ux/manager-react-components';
import {
  VeeamBackup,
  useVeeamBackupList,
  getVeeamBackupDisplayName,
  getOrganizationIdFromBackup,
  getRegionNameFromAzName,
} from '@ovh-ux/manager-module-vcd-api';
import {
  applyFilters,
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import ErrorBanner from '@/components/Error/Error';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { urls } from '@/routes/routes.constant';
import { MessagesViewer } from '@/components/Messages/MessageViewer.component';
import {
  DisplayNameCell,
  ActionCell,
  OvhRefCell,
  RegionCell,
  CreatedAtCell,
  OrganizationCell,
  LocationCell,
} from './DatagridCell.component';
import { productName } from '@/veeam-backup.config';
import { Loading } from '@/components/Loading/Loading';
import { BackupStatusBadge } from '@/components/BackupStatus/BackupStatusBadge.component';
import { CHANGELOG_LINKS } from '@/constants';
import VeeamGuidesHeader from '@/components/Guide/VeeamGuidesHeader';

export type VeeamBackupDatagrid = {
  id: string;
  name: string;
  organizationId: string;
  location: string;
} & Pick<VeeamBackup, 'iam' | 'createdAt' | 'resourceStatus'>;

export const veeamBackupToVeeamBackupDatagrid = (
  veeamBackup: VeeamBackup,
): VeeamBackupDatagrid => {
  return {
    id: veeamBackup.id,
    name: getVeeamBackupDisplayName(veeamBackup),
    organizationId: getOrganizationIdFromBackup(veeamBackup),
    location: getRegionNameFromAzName(veeamBackup.currentState.azName),
    createdAt: veeamBackup.createdAt,
    iam: veeamBackup.iam,
    resourceStatus: veeamBackup.resourceStatus,
  };
};

export default function Listing() {
  const { t } = useTranslation(['veeam-backup', 'listing']);
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const {
    data,
    flattenData,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    error,
    status,
  } = useVeeamBackupList({ pageSize: 9999 });

  const columns: DatagridColumn<VeeamBackupDatagrid>[] = [
    {
      id: 'name',
      label: t('listing:name_cell'),
      isSortable: true,
      cell: DisplayNameCell,
      isSearchable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'resourceStatus',
      label: t('listing:status_cell'),
      isSortable: true,
      cell: BackupStatusBadge,
      isFilterable: true,
      type: FilterTypeCategories.Options,
      filterOptions: [
        { label: t('veeam-backup:status-READY'), value: 'READY' },
        { label: t('veeam-backup:status-CREATING'), value: 'CREATING' },
        { label: t('veeam-backup:status-DISABLED'), value: 'DISABLED' },
        { label: t('veeam-backup:status-DISABLING'), value: 'DISABLING' },
        { label: t('veeam-backup:status-REMOVED'), value: 'REMOVED' },
        { label: t('veeam-backup:status-REMOVING'), value: 'DISABLING' },
        { label: t('veeam-backup:status-UPDATING'), value: 'UPDATING' },
      ],
    },
    {
      id: 'id',
      label: t('listing:ovhref_cell'),
      isSortable: false,
      cell: OvhRefCell,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'organizationId',
      label: t('listing:vcdorg_cell'),
      isSortable: false,
      cell: OrganizationCell,
      isFilterable: false,
    },
    {
      id: 'region',
      label: t('listing:region_cell'),
      isSortable: false,
      cell: LocationCell,
    },
    {
      id: 'location',
      label: t('listing:location_cell'),
      isSortable: true,
      cell: RegionCell,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'createdAt',
      label: t('listing:createdat_cell'),
      isSortable: false,
      cell: CreatedAtCell,
      isFilterable: true,
      type: FilterTypeCategories.Date,
    },
    {
      id: 'action',
      label: '',
      isSortable: false,
      cell: ActionCell,
    },
  ];

  const header: HeadersProps = {
    title: productName,
    changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
    headerButton: <VeeamGuidesHeader />,
  };

  return (
    <RedirectionGuard
      isLoading={isLoading || (!flattenData && !isError)}
      condition={status === 'success' && data?.pages[0].data.length === 0}
      route={urls.onboarding}
      isError={isError}
      errorComponent={<ErrorBanner error={error} />}
    >
      <BaseLayout
        breadcrumb={<Breadcrumb />}
        header={header}
        description={t('listing:description')}
        message={<MessagesViewer />}
      >
        <div className="flex mb-6">
          <OdsButton
            variant="outline"
            onClick={() => navigate(urls.orderVeeam)}
            label={t('listing:order_button')}
          />
        </div>

        <React.Suspense fallback={<Loading />}>
          {flattenData && (
            <Datagrid
              columns={columns}
              items={applyFilters(
                flattenData.map(veeamBackupToVeeamBackupDatagrid) ?? [],
                !searchInput || searchInput.length === 0
                  ? filters
                  : [
                      {
                        key: 'name',
                        value: searchInput,
                        comparator: FilterComparator.Includes,
                      },
                      ...filters,
                    ],
              )}
              totalItems={flattenData.length || 0}
              hasNextPage={hasNextPage}
              onFetchNextPage={() => fetchNextPage()}
              contentAlignLeft
              filters={{ filters, add: addFilter, remove: removeFilter }}
              search={{
                searchInput,
                setSearchInput,
                onSearch: () => {},
              }}
            />
          )}
        </React.Suspense>
        <Outlet />
      </BaseLayout>
    </RedirectionGuard>
  );
}
