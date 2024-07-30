import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import {
  Datagrid,
  DataGridTextCell,
  useResourcesV6,
  dataType,
  ColumnDatagrid,
} from '@ovhcloud/manager-components';

export default function IpsWithoutIceberg() {
  const [columns, setColumns] = useState<ColumnDatagrid[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data,
    flattenData,
    fetchNextPage,
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
    columns,
    route: '/cloud/project/e42b4f068f444ea3832435304a316330/aggregated/network',
    queryKey: ['servicesListingIcebergVPS-withoyarn sut-iceberg'],
  });

  const navigateToDashboard = (label: string) => {
    const path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    navigate(`${path}${label}`);
  };

  useEffect(() => {
    if (status === 'success' && data?.data[0]?.length === 0) {
      navigate('');
    } else if (
      status === 'success' &&
      data?.data[0]?.length > 0 &&
      columns.length === 0
    ) {
      const tmp = Object.keys(data.data[0][0])
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
        .map((element) => {
          const obj = {
            id: element,
            header: element,
            label: element,
            accessorKey: element,
            type: dataType(data.data[0][0][element]),
            cell: (props: any) => {
              const label = props[element] as string;
              if (typeof label === 'string' || typeof label === 'number') {
                return <DataGridTextCell>{label}</DataGridTextCell>;
              }
              return <DataGridTextCell>{label}</DataGridTextCell>;
            },
          };
          return obj;
        });
      setColumns(tmp);
    }
  }, [data]);

  return (
    <>
      <div className="pt-5 pb-10">
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
              pagination={{ pageIndex, pageSize: 10 }}
              hasNextPage={hasNextPage}
              onFetchNextPage={fetchNextPage}
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
