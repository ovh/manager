import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Datagrid,
  DataGridTextCell,
  useResourcesIcebergV6,
  dataType,
  BaseLayout,
} from '@ovh-ux/manager-react-components';

import Loading from '@/components/Loading/Loading.component';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';

import appConfig from '@/hycu.config';
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
    route: '/license/hycu',
    queryKey: ['hycu', '/license/hycu'],
  });

  const navigateToDashboard = (label: string) => {
    const path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    navigate(`${path}${label}`);
  };

  useEffect(() => {
    const isSuccess = status === 'success';
    if (columns && isSuccess && flattenData?.length > 0) {
      const newColumns = Object.keys(flattenData[0])
        .filter((element) => element !== 'iam')
        .map((element) => ({
          id: element,
          label: element,
          type: dataType(
            (flattenData[0] as { [key: string]: string })[element],
          ),
          cell: (props: { [key: string]: string }) => {
            const label = props[element];
            if (typeof label === 'string' || typeof label === 'number') {
              if (serviceKey === element)
                return (
                  <DataGridTextCell>
                    <OsdsLink
                      color={ODS_THEME_COLOR_INTENT.primary}
                      onClick={() => navigateToDashboard(label)}
                    >
                      {label}
                    </OsdsLink>
                  </DataGridTextCell>
                );
              return <DataGridTextCell>{label}</DataGridTextCell>;
            }
            return <div>-</div>;
          },
        }));
      setColumns(newColumns);
    } else if (isSuccess && !flattenData?.length) {
      navigate(urls.onboarding);
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
