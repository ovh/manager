import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Navigate,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Datagrid,
  DataGridTextCell,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import { getShares } from '@/api';

import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

import appConfig from '@/pci-file-storage.config';

export default function Listing() {
  const myConfig = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const [res, setRes] = useState([]);
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();
  const { pageIndex, pageSize } = pagination;
  const { t } = useTranslation('pci-file-storage/listing');
  const { projectId } = useParams();
  const { data, isError, error, isLoading, status }: any = useQuery({
    queryKey: [`servicesListingIceberg-${pageIndex + 1}-${pageSize}`],
    queryFn: () => getShares({ projectId, pageSize, page: pageIndex + 1 }),
    staleTime: Infinity,
    enabled: true,
  });

  const navigateToDashabord = (label: string) => {
    const path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    navigate(`${path}${label}`);
  };

  useEffect(() => {
    if (status === 'success' && data?.data) {
      setRes(data?.data);
      const newColumns = Object.keys(data?.data[0])
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
                      onClick={() => navigateToDashabord(label)}
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
    }
  }, [data?.data]);

  if (isError) {
    return <ErrorBanner error={error.response} />;
  }

  if (isLoading && pageIndex === 0) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (data?.length === 0) return <Navigate to="onboarding" />;

  return (
    <>
      <div className="pt-5 pb-10">
        <Breadcrumb />
        <h2>pci-file-storage</h2>
        <React.Suspense>
          {columns && res && (
            <Datagrid
              columns={columns}
              items={res || []}
              totalItems={data?.totalCount || 0}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortChange={setSorting}
            />
          )}
        </React.Suspense>
      </div>
    </>
  );
}
