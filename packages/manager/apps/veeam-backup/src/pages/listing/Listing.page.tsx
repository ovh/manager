import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OsdsButton, OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Datagrid,
  DataGridTextCell,
  useDatagridSearchParams,
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
  getDisplayName,
  useOrganizations,
  getOrganizationDisplayName,
  useRegions,
  useVeeamBackupList,
} from '@/data';
import { StatusCell } from './StatusCell.component';
import { CreatedAtCell } from './CreatedAtCell.component';

export default function Listing() {
  const { t } = useTranslation('listing');
  const [flattenData, setFlattenData] = React.useState([]);
  const navigate = useNavigate();
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();
  const { pageSize } = pagination;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    error,
    status,
  } = useVeeamBackupList({ pageSize });
  const { data: regions } = useRegions();
  const { data: organizations } = useOrganizations();

  console.log(organizations?.data);
  console.log(data?.pages);

  const columns: DatagridColumn<VeeamBackupWithIam>[] = [
    {
      id: 'name',
      label: t('nameCell'),
      isSortable: true,
      cell: (backup) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => navigate(urls.dashboard.replace(':id', backup.id))}
          >
            {getDisplayName(backup)}
          </OsdsLink>
        </DataGridTextCell>
      ),
    },
    {
      id: 'status',
      label: t('statusCell'),
      isSortable: true,
      cell: (backup) => <StatusCell {...backup} />,
    },
    {
      id: 'ovhref',
      label: t('ovhrefCell'),
      isSortable: true,
      cell: (backup) => <DataGridTextCell>{backup.id}</DataGridTextCell>,
    },
    {
      id: 'vcdorg',
      label: t('vcdorgCell'),
      isSortable: true,
      cell: (backup) => (
        <DataGridTextCell>
          {getOrganizationDisplayName(
            organizations?.data?.find((o) => backup.id.includes(o.id)),
          )}
        </DataGridTextCell>
      ),
    },
    {
      id: 'region',
      label: t('regionCell'),
      isSortable: true,
      cell: (backup) => (
        <DataGridTextCell>
          {
            regions?.data.find((r) => r.region === backup.currentState.region)
              ?.location
          }
        </DataGridTextCell>
      ),
    },
    {
      id: 'createdat',
      label: t('createdatCell'),
      isSortable: true,
      cell: (backup) => <CreatedAtCell {...backup} />,
    },
    {
      id: 'action',
      label: '',
      cell: (backup) => (
        <ActionMenu
          isCompact
          items={[
            {
              id: 0,
              label: 'delete',
              color: ODS_THEME_COLOR_INTENT.error,
              onClick: () =>
                navigate(urls.deleteVeeam.replace(':id', backup.id)),
            },
          ]}
        />
      ),
    },
  ];

  React.useEffect(() => {
    if (status === 'success' && data?.pages[0].data.length === 0) {
      navigate(urls.onboarding);
    }
  }, [status, data]);

  React.useEffect(() => {
    const flatten = data?.pages.map((page: any) => page.data).flat();
    setFlattenData(flatten);
  }, [data]);

  if (isError) {
    return <ErrorBanner error={error} />;
  }

  if (isLoading && !flattenData) {
    return (
      <div>
        <Loading />
      </div>
    );
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
          {t('orderButton')}
        </OsdsButton>
      </div>
      <React.Suspense>
        {columns && flattenData && (
          <Datagrid
            columns={columns}
            items={flattenData || []}
            totalItems={0}
            pagination={pagination}
            onPaginationChange={setPagination}
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
              onClick={fetchNextPage as any}
            >
              Load more
            </OsdsButton>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
