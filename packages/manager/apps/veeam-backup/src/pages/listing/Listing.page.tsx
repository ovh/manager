import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Outlet } from 'react-router-dom';
import { OsdsButton, OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Datagrid,
  DataGridTextCell,
  BaseLayout,
  DatagridColumn,
  ActionMenu,
} from '@ovhcloud/manager-components';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { urls } from '@/routes/routes.constant';
import { SuccessMessages } from '@/components/Messages/SuccessMessage.component';
import {
  VeeamBackupWithIam,
  getVeeamBackupDisplayName,
  useOrganizations,
  useRegions,
  useVeeamBackupList,
  getVeeamBackupVCDOrganizationDisplayName,
} from '@/data';
import { StatusCell } from './StatusCell.component';
import { CreatedAtCell } from './CreatedAtCell.component';
import { sortVeeamBackups } from './sorting';
import { iamActions } from '@/veeam-backup.config';

export default function Listing() {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();
  const regions = useRegions();
  const organizations = useOrganizations();
  const {
    data,
    flattenData,
    sorting,
    setSorting,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    error,
    status,
  } = useVeeamBackupList({
    pageSize: 10,
    defaultSorting: { id: 'name', desc: false },
    sort: sortVeeamBackups(organizations?.flattenData),
  });

  const columns: DatagridColumn<VeeamBackupWithIam>[] = [
    {
      id: 'name',
      label: t('name_cell'),
      isSortable: true,
      cell: (backup) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => navigate(urls.dashboard.replace(':id', backup.id))}
          >
            {getVeeamBackupDisplayName(backup)}
          </OsdsLink>
        </DataGridTextCell>
      ),
    },
    {
      id: 'status',
      label: t('status_cell'),
      isSortable: true,
      cell: (backup) => <StatusCell {...backup} />,
    },
    {
      id: 'ovhref',
      label: t('ovhref_cell'),
      isSortable: true,
      cell: (backup) => <DataGridTextCell>{backup.id}</DataGridTextCell>,
    },
    {
      id: 'vcdorg',
      label: t('vcdorg_cell'),
      isSortable: true,
      cell: (backup) => (
        <DataGridTextCell>
          {getVeeamBackupVCDOrganizationDisplayName(
            organizations?.flattenData,
            backup,
          )}
        </DataGridTextCell>
      ),
    },
    {
      id: 'region',
      label: t('region_cell'),
      isSortable: true,
      cell: (backup) => (
        <DataGridTextCell>
          {
            regions?.flattenData?.find(
              (r) => r.region === backup.currentState.region,
            )?.location
          }
        </DataGridTextCell>
      ),
    },
    {
      id: 'createdat',
      label: t('createdat_cell'),
      isSortable: true,
      cell: (backup) => <CreatedAtCell {...backup} />,
    },
    {
      id: 'action',
      label: '',
      isSortable: false,
      cell: (backup) => (
        <ActionMenu
          isCompact
          items={[
            {
              id: 0,
              label: t('delete_action'),
              color: ODS_THEME_COLOR_INTENT.error,
              urn: backup.iam.urn,
              iamActions: [iamActions.vmwareCloudDirectorBackupGet],
              onClick: () =>
                navigate(urls.deleteVeeam.replace(':id', backup.id)),
            },
          ]}
        />
      ),
    },
  ];

  React.useEffect(() => {
    if (status === 'success') {
      if (data?.pages[0].data.length === 0) {
        navigate(urls.onboarding);
      }
    }
  }, [status, data]);

  if (isError) {
    return <ErrorBanner error={error} />;
  }

  if (isLoading && !flattenData) {
    return <Loading />;
  }

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: 'Managed Veeam for VCD',
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
      <React.Suspense>
        {flattenData && (
          <Datagrid
            columns={columns}
            items={flattenData}
            totalItems={flattenData.length || 0}
            pagination={null}
            sorting={sorting}
            onSortChange={setSorting}
          />
        )}
      </React.Suspense>
      <div className="grid justify-items-center my-5">
        {hasNextPage && (
          <div>
            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.info}
              variant={ODS_BUTTON_VARIANT.stroked}
              onClick={() => fetchNextPage()}
            >
              {t('load_more_button')}
            </OsdsButton>
          </div>
        )}
      </div>
      <Outlet />
    </BaseLayout>
  );
}
