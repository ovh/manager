import React, { useEffect, useState, startTransition } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FilterCategories,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { useNavigate, useLocation } from 'react-router-dom';

import { OdsButton, OdsSpinner, OdsIcon } from '@ovhcloud/ods-components/react';
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
  dataType,
  BaseLayout,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';

import appConfig from '@/pci-project.config';

type ErrorResponse = {
  response?: {
    headers?: Record<string, string>;
    status?: number;
  };
};

export default function Listing() {
  const myConfig = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const [columns, setColumns] = useState<
    DatagridColumn<Record<string, unknown>>[]
  >([]);
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
    route: `/cloud/project`,
    queryKey: ['pci-project', `/cloud/project`],
  });

  const navigateToDashboard = (label: string) => {
    const path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    startTransition(() => navigate(`${path}${label}`));
  };

  const typeToFilterType = (type: string): FilterTypeCategories => {
    switch (type.toLowerCase()) {
      case 'number':
        return FilterTypeCategories.Numeric;
      case 'date':
        return FilterTypeCategories.Date;
      case 'string':
        return FilterTypeCategories.String;
      case 'boolean':
        return FilterTypeCategories.Boolean;
      default:
        return FilterTypeCategories.String;
    }
  };

  useEffect(() => {
    if (
      columns.length === 0 &&
      status === 'success' &&
      flattenData?.length > 0
    ) {
      const newColumns = Object.keys(flattenData[0] as Record<string, unknown>)
        .filter((element) => element !== 'iam')
        .map((element) => {
          const type = dataType(flattenData[0][element]);
          const filterType = typeToFilterType(type);

          return {
            id: element,
            label: element,
            isFilterable: true,
            isSearchable: true,
            type: filterType,
            comparator: FilterCategories[filterType],
            cell: (props: Record<string, unknown>) => {
              const label = props[element] as string | number;
              if (typeof label === 'string' || typeof label === 'number') {
                if (serviceKey === element)
                  return (
                    <DataGridTextCell>
                      <OdsButton
                        variant={ODS_BUTTON_VARIANT.ghost}
                        onClick={() => navigateToDashboard(label.toString())}
                        label={label.toString()}
                      >
                        {label.toString()}
                      </OdsButton>
                    </DataGridTextCell>
                  );
                return <DataGridTextCell>{label.toString()}</DataGridTextCell>;
              }
              return <DataGridTextCell>-</DataGridTextCell>;
            },
          };
        });
      setColumns(newColumns);
    }
  }, [flattenData, serviceKey]);

  if (isError) {
    const { response } = error as ErrorResponse;
    const errorObj = {
      data: error,
      headers: response?.headers,
      status: response?.status,
    };
    return <ErrorBanner error={errorObj} />;
  }

  if (isLoading && !flattenData) {
    return (
      <div
        className="flex justify-center"
        data-testid="listing-spinner-container"
      >
        <OdsSpinner />
      </div>
    );
  }

  const header = {
    title: t('title'),
  };

  const TopbarCTA = () => (
    <div>
      <OdsButton
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.sm}
        label="Add service"
      >
        <OdsIcon name={ODS_ICON_NAME.plus} />
        Add service
      </OdsButton>
    </div>
  );

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb rootLabel={appConfig.rootLabel} appName="pci-project" />
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
