import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import {
  Datagrid,
  DataGridTextCell,
  useResourcesIcebergV6,
  dataType,
  BaseLayout,
} from '@ovh-ux/manager-react-components';

import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

import appConfig from '@/sap-features-hub.config';

export default function Listing() {
  const myConfig = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const [columns, setColumns] = useState([]);
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
    sorting,
    setSorting,
    pageIndex,
  } = useResourcesIcebergV6({
    route: `/dedicatedCloud`,
    queryKey: ['sap-features-hub', `/dedicatedCloud`],
  });

  const navigateToDashboard = (label: string) => {
    const path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    navigate(`${path}${label}`);
  };

  useEffect(() => {
    if (columns && status === 'success' && flattenData?.length > 0) {
      const newColumns = Object.keys(flattenData[0])
        .filter((element) => element !== 'iam')
        .map((element) => ({
          id: element,
          label: element,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type: dataType(flattenData[0][element]),
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
    return <ErrorBanner error={error.message} />;
  }

  if (isLoading && pageIndex === 1) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  const header = {
    title: t('title'),
  };

  return (
    <BaseLayout breadcrumb={<Breadcrumb />} header={header}>
      <React.Suspense>
        {columns && flattenData && (
          <Datagrid
            columns={columns}
            items={flattenData || []}
            totalItems={totalCount || 0}
            hasNextPage={hasNextPage && !isLoading}
            onFetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortChange={setSorting}
          />
        )}
      </React.Suspense>
    </BaseLayout>
  );
}
