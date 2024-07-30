import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import {
  Datagrid,
  DataGridTextCell,
  useResourcesIcebergV6,
} from '@ovhcloud/manager-components';

export default function Vps() {
  const { t } = useTranslation('listing');
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data,
    flattenData,
    fetchNextPage,
    pageIndex,
    totalCount,
    hasNextPage,
    isError,
    error,
    isLoading,
    status,
    sorting,
    setSorting,
  } = useResourcesIcebergV6({
    route: '/vps',
    queryKey: ['servicesListingIcebergVPS'],
  });

  const navigateToDashboard = (label: string) => {
    const path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    navigate(`${path}${label}`);
  };

  useEffect(() => {
    if (status === 'success' && flattenData?.length === 0) {
      navigate('');
    } else if (
      status === 'success' &&
      flattenData?.length > 0 &&
      columns.length === 0
    ) {
      const tmp = Object.keys(flattenData[0])
        .filter((element) => element !== 'iam')
        .filter((element) => element !== 'keymap')
        .filter((element) => element !== 'slaMonitoring')
        .filter((element) => element !== 'monitoringIpBlocks')
        .filter((element) => element !== 'model')
        .filter((element) => element !== 'cluster')
        .map((element) => ({
          id: element,
          header: element,
          label: `t${element}`,
          accessorKey: element,
          type:
            element === 'vcore' || element === 'memoryLimit'
              ? 'number'
              : 'string',
          cell: (props: any) => {
            const label = props[element] as string;
            if (typeof label === 'string' || typeof label === 'number') {
              return <DataGridTextCell>{label}</DataGridTextCell>;
            }
            return <div>-</div>;
          },
        }));
      setColumns(tmp);
    }
  }, [flattenData]);

  return (
    <>
      <div className="pt-5 pb-10">
        <h2>/VPS</h2>
        <h3>V6 ENDPOINT WITH ICEBERG</h3>
        <React.Suspense>
          {columns && (
            <Datagrid
              columns={columns}
              items={flattenData || []}
              totalItems={totalCount}
              sorting={sorting}
              onSortChange={setSorting}
              pagination={{ pageIndex, pageSize: 10 }}
              onFetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
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
