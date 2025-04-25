import React from 'react';
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
} from '@ovh-ux/manager-react-components';
import {
  VeeamBackup,
  useVeeamBackupList,
} from '@ovh-ux/manager-module-vcd-api';
import ErrorBanner from '@/components/Error/Error';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { urls } from '@/routes/routes.constant';
import { SuccessMessages } from '@/components/Messages/SuccessMessage.component';
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

export default function Listing() {
  const { t } = useTranslation('listing');
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
  } = useVeeamBackupList({ pageSize: 10 });

  const columns: DatagridColumn<VeeamBackup>[] = [
    {
      id: 'name',
      label: t('name_cell'),
      isSortable: false,
      cell: DisplayNameCell,
    },
    {
      id: 'status',
      label: t('status_cell'),
      isSortable: false,
      cell: BackupStatusBadge,
    },
    {
      id: 'ovhref',
      label: t('ovhref_cell'),
      isSortable: false,
      cell: OvhRefCell,
    },
    {
      id: 'vcdorg',
      label: t('vcdorg_cell'),
      isSortable: false,
      cell: OrganizationCell,
    },
    {
      id: 'location',
      label: t('location_cell'),
      isSortable: false,
      cell: LocationCell,
    },
    {
      id: 'region',
      label: t('region_cell'),
      isSortable: false,
      cell: RegionCell,
    },
    {
      id: 'createdat',
      label: t('createdat_cell'),
      isSortable: false,
      cell: CreatedAtCell,
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
        description={t('description')}
        message={<SuccessMessages />}
      >
        <div className="flex mb-6">
          <OdsButton
            variant="outline"
            onClick={() => navigate(urls.orderVeeam)}
            label={t('order_button')}
          />
        </div>

        <React.Suspense fallback={<Loading />}>
          {flattenData && (
            <Datagrid
              columns={columns}
              items={flattenData}
              totalItems={flattenData.length || 0}
              hasNextPage={hasNextPage}
              onFetchNextPage={() => fetchNextPage()}
              contentAlignLeft
            />
          )}
        </React.Suspense>
        <Outlet />
      </BaseLayout>
    </RedirectionGuard>
  );
}
