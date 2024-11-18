import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

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

import appConfig from '@/ips.config';
import { urls } from '@/routes/routes.constant';

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
    route: `/ip`,
    queryKey: ['ips', `/ip`],
  });

  if (!isLoading && flattenData?.length === 0) {
    navigate(urls.onboarding);
  }

  useEffect(() => {
    if (columns && status === 'success' && flattenData?.length > 0) {
      const newColumns = Object.keys(flattenData[0])
        .filter((element) => element !== 'iam')
        .map((element) => ({
          id: element,
          label: element,
          type: 'string',
          cell: (props: any) => {
            const label = props[element] as string;
            if (typeof label === 'string' || typeof label === 'number') {
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
      <div>
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
