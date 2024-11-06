import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Outlet } from 'react-router-dom';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Datagrid,
  BaseLayout,
  DatagridColumn,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import {
  VeeamBackupWithIam,
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

  const columns: DatagridColumn<VeeamBackupWithIam>[] = [
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
        header={{
          title: productName,
        }}
        description={t('description')}
        message={<SuccessMessages />}
      >
        <div className="flex mb-6">
          <OsdsButton
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            inline
            onClick={() => navigate(urls.orderVeeam)}
          >
            {t('order_button')}
          </OsdsButton>
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
