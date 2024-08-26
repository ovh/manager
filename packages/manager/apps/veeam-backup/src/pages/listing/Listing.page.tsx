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
} from '@ovhcloud/manager-components';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { urls } from '@/routes/routes.constant';
import { SuccessMessages } from '@/components/Messages/SuccessMessage.component';
import { VeeamBackupWithIam, useVeeamBackupList } from '@/data';
import {
  DisplayNameCell,
  ActionCell,
  OvhRefCell,
  RegionCell,
  CreatedAtCell,
  StatusCell,
  OrganizationCell,
} from './DatagridCell.component';

export default function Listing() {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();
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
      cell: StatusCell,
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
