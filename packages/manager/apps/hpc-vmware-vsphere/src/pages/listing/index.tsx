import React, { useEffect, useState, startTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { useNavigate, useLocation } from 'react-router-dom';

import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  Breadcrumb,
  Datagrid,
  DataGridTextCell,
  ErrorBanner,
  useResourcesIcebergV6,
  BaseLayout,
} from '@ovh-ux/manager-react-components';

import appConfig from '@/hpc-vmware-vsphere.config';

export default function Listing() {
  const myConfig = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const [columns, setColumns] = useState<any>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('listing');
  const {
    flattenData,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    status,
    search,
    sorting,
    setSorting,
    filters,
  } = useResourcesIcebergV6({
    columns,
    route: `/dedicatedCloud`,
    queryKey: ['hpc-vmware-vsphere', `/dedicatedCloud`],
  });

  const navigateToDashboard = (label: string) => {
    const path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    startTransition(() => navigate(`${path}${label}`));
  };

  // Code to remove and declare definition columns in const variable
  useEffect(() => {
    if (
      columns.length === 0 &&
      status === 'success' &&
      flattenData?.length > 0
    ) {
      const newColumns = Object.keys(flattenData[0] as Record<string, unknown>)
        .filter((element) => element !== 'iam')
        .map((element) => ({
          id: element,
          label: element,
          isFilterable: true,
          isSearchable: true,
          cell: (props: any) => {
            const label = props[element] as string;
            if (typeof label === 'string' || typeof label === 'number') {
              if (serviceKey === element)
                return (
                  <DataGridTextCell>
                    <OdsButton
                      variant={ODS_BUTTON_VARIANT.ghost}
                      onClick={() => navigateToDashboard(label)}
                      label={label}
                    />
                  </DataGridTextCell>
                );
              return <DataGridTextCell>{label}</DataGridTextCell>;
            }
            return <div>-</div>;
          },
        }));
      setColumns(newColumns);
    }
  }, [flattenData]);

  if (isError) {
    const { response }: any = error;
    const errorObj = {
      data: error,
      headers: response.headers,
      status: response.status,
    };
    return <ErrorBanner error={errorObj} />;
  }

  const header = {
    title: t('title'),
  };

  const TopbarCTA = () => (
    <div>
      <OdsButton
        icon={ODS_ICON_NAME.plus}
        size={ODS_BUTTON_SIZE.sm}
        label="Add service"
      />
    </div>
  );

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb
          rootLabel={appConfig.rootLabel}
          appName="hpc-vmware-vsphere"
        />
      }
      header={header}
    >
      <React.Suspense>
        {columns && (
          <Datagrid
            columns={columns}
            items={flattenData || []}
            totalItems={totalCount || 0}
            hasNextPage={hasNextPage && !isLoading}
            onFetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortChange={setSorting}
            isLoading={isLoading}
            filters={filters}
            search={search}
            topbar={<TopbarCTA />}
          />
        )}
      </React.Suspense>
    </BaseLayout>
  );
}
