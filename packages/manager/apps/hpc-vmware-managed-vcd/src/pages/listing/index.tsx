import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

import { OsdsButton, OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import {
  Datagrid,
  DataGridTextCell,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';

import { getListingIcebergV2 } from '@/data/api/hpc-vmware-managed-vcd';

import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

import appConfig from '@/hpc-vmware-managed-vcd.config';
import { urls } from '@/routes/routes.constant';

export default function Listing() {
  const { t } = useTranslation('listing');
  const myConfig = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const [columns, setColumns] = useState([]);
  const [flattenData, setFlattenData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
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
  }: any = useInfiniteQuery({
    initialPageParam: null,
    queryKey: [`servicesListingIceberg`],
    queryFn: ({ pageParam }) =>
      getListingIcebergV2({ pageSize, cursor: pageParam }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: (lastPage) => lastPage.cursorNext as any,
  });

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

  useEffect(() => {
    const flatten = data?.pages.map((page: any) => page.data).flat();
    setFlattenData(flatten);
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
                onClick={fetchNextPage}
              >
                Load more
              </OsdsButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
