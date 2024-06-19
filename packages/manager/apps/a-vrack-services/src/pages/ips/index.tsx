import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { Datagrid, DataGridTextCell } from '@ovhcloud/manager-components';

import useResourcesV6 from '@ovhcloud/manager-components/src/hooks/datagrid/useResourcesV6';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

import appConfig from '@/a-vrack-services.config';
import { urls } from '@/routes/routes.constant';

export default function IpsWithoutIceberg() {
  const myConfig = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data,
    flattenData,
    onFetchNextPage,
    setSorting,
    sorting,
    pageIndex,
    hasNextPage,
    totalCount,
    isError,
    error,
    isLoading,
    status,
  } = useResourcesV6({
    route: '/ip',
    queryKey: 'servicesListingIcebergVPS-without-iceberg',
  });

  const navigateToDashboard = (label: string) => {
    const path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    navigate(`${path}${label}`);
  };

  useEffect(() => {
    if (status === 'success' && data?.data.length === 0) {
      navigate(urls.onboarding);
    } else if (
      status === 'success' &&
      data?.data.length > 0 &&
      columns.length === 0
    ) {
      const tmp = Object.keys(data?.data[0])
        .filter((element) => element !== 'iam')
        .filter((element) => element !== 'rir')
        .filter((element) => element !== 'country')
        .filter((element) => element !== 'regions')
        .filter((element) => element !== 'description')
        .filter((element) => element !== 'routedTo')
        .filter((element) => element !== 'bringYourOwnIp')
        .filter((element) => element !== 'isAdditionalIp')
        .filter((element) => element !== 'organisationId')
        .filter((element) => element !== 'canBeTerminated')
        .map((element) => ({
          id: element,
          header: element,
          label: element,
          accessorKey: element,
          type: element === 'version' ? 'number' : 'string',
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
    <>
      <div className="pt-5 pb-10">
        <Breadcrumb />
        <h2>/IP</h2>
        <h3>V6 ENDPOINT WITHOUT ICEBERG</h3>
        <React.Suspense>
          {columns && (
            <Datagrid
              columns={columns}
              items={flattenData || []}
              totalItems={totalCount}
              sorting={sorting}
              onSortChange={setSorting}
              setSorting={setSorting}
              manualSorting={false}
              pagination={{ pageIndex, pageSize: 10 }}
              hasNextPage={hasNextPage}
              fetchNextPage={onFetchNextPage}
            />
          )}
        </React.Suspense>
        <div>
          <OsdsLink onClick={() => navigate('/')}>Go Home</OsdsLink>
        </div>
      </div>
    </>
  );
}
