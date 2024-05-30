import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import {
  Datagrid,
  DataGridTextCell,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';

import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

import appConfig from '@/a-vrack-services.config';
import { urls } from '@/routes/routes.constant';

import useResourcesIcebergV2 from '@/data/hooks/datagrid/useIcebergV2';

export default function Listing() {
  const { t } = useTranslation('listing');
  const myConfig = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    flattenData,
    isError,
    isLoading,
    error,
    status,
  }: any = useResourcesIcebergV2({
    route: '/iam/policy',
    queryKey: 'servicesListingIcebergIamAction',
  });
  const { sorting, setSorting } = useDatagridSearchParams();

  const navigateToDashboard = (label: string) => {
    const path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    navigate(`${path}${label}`);
  };

  useEffect(() => {
    if (status === 'success' && data?.pages[0].data.length === 0) {
      navigate(urls.onboarding);
    } else if (status === 'success' && data?.pages.length > 0 && !flattenData) {
      const tmp = Object.keys(data?.pages[0].data[0])
        .filter((element) => element !== 'iam')
        .map((element) => ({
          id: element,
          header: element,
          label: element,
          accessorKey: element,
          cell: (props: any) => {
            const label = props[element] as string;
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
      setColumns(tmp);
    }
  }, [data]);

  if (isError) {
    return <ErrorBanner error={error.response} />;
  }

  if (isLoading && !flattenData) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="pt-5 pb-10">
        <Breadcrumb />
        <h2>a-iam</h2>
        <div>{t('title')}</div>
        <React.Suspense>
          {columns && flattenData && (
            <Datagrid
              columns={columns}
              items={flattenData || []}
              totalItems={0}
              sorting={sorting}
              onSortChange={setSorting}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
            />
          )}
        </React.Suspense>
      </div>
    </>
  );
}
