import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import axios from 'axios';
import {
  Breadcrumb,
  Datagrid,
  DataGridTextCell,
  ErrorBanner,
  useResourcesIcebergV6,
  BaseLayout,
} from '@ovh-ux/manager-react-components';

import appConfig from '@/a-dedicated-3.config';

export default function Listing() {
  const { t } = useTranslation('listing');
  const [flatTmp, setFlatTmp] = useState([]);
  const {
    flattenData,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    setSorting,
    pageIndex,
  } = useResourcesIcebergV6({
    route: `/dedicated/server`,
    queryKey: ['a-dedicated-3', `/dedicated/server`],
  });
  const fetchMorty = async (index: any) => {
    const result = await axios.get(
      `https://rickandmortyapi.com/api/character/?page=${index + 1}`,
    );
    return result?.data?.results;
  };

  const onExpendedChange = async (row: any) => {
    const morty = await fetchMorty(row?.index);
    const test = Date.now();
    const tmp = flattenData.map((elem: any, index) => ({
      ...elem,
      ...(index % 1 === 0 && {
        subRows: morty.map((elem2: any) => ({
          ip: `${elem2.name} ${index} ${row?.original?.ip}`,
          os: `${elem2.species} ${index} ${test}`,
          region: `${elem2.status} ${index}`,
          linkSpeed: `${elem2.gender} ${index}`,
        })),
      }),
    }));
    setFlatTmp(tmp);
  };

  const columns = [
    {
      id: 'ip',
      label: 'ip',
      type: FilterCategories.String,
      cell: ({ row }: any) => (
        <div
          style={{
            paddingLeft: `${row.depth * 4}rem`,
          }}
        >
          <span className="mr-[10px]">
            {row.getCanExpand() && (
              <OdsButton
                variant={ODS_BUTTON_VARIANT.ghost}
                icon={
                  row.getIsExpanded()
                    ? ODS_ICON_NAME.chevronDown
                    : ODS_ICON_NAME.chevronRight
                }
                onClick={() => {
                  row.getToggleExpandedHandler()();
                  onExpendedChange(row);
                }}
                label=""
              />
            )}
          </span>
          <span>
            <DataGridTextCell>{row.original.ip}</DataGridTextCell>
          </span>
        </div>
      ),
    },
    {
      id: 'os',
      label: 'os',
      type: FilterCategories.String,
      cell: ({ row }: any) => (
        <DataGridTextCell>{row.original.os}</DataGridTextCell>
      ),
    },
    {
      id: 'region',
      label: 'region',
      type: FilterCategories.String,
      cell: ({ row }: any) => (
        <DataGridTextCell>{row.original.region}</DataGridTextCell>
      ),
    },
    {
      id: 'linkSpeed',
      label: 'linkSpeed',
      type: FilterCategories.Numeric,
      cell: ({ row }: any) => (
        <DataGridTextCell>{row.original.linkSpeed}</DataGridTextCell>
      ),
    },
  ];
  useEffect(() => {
    if (flattenData) {
      const tmp = flattenData.map((element: any, index) => ({
        ...element,
        ...(index % 1 === 0 && {
          subRows: [
            {
              ip: `${element.ip} ${index}`,
              os: `${element.os} ${index}`,
              region: `${element.region} ${index}`,
              linkSpeed: `${element.linkSpeed} ${index}`,
            },
            {
              ip: `${element.ip} 2`,
              os: `${element.os} 2`,
              region: `${element.region} 2`,
              linkSpeed: `${element.linkSpeed} 2`,
            },
            {
              ip: `${element.ip} 3`,
              os: `${element.os} 3`,
              region: `${element.region} 3`,
              linkSpeed: `${element.linkSpeed} 3`,
            },
          ],
        }),
      }));
      setFlatTmp(tmp);
    }
  }, [flattenData]);

  if (isError) {
    const { response }: any = error;
    const errorObj = {
      data: error,
      headers: response.headers,
      status: response.status,
    };
    return <ErrorBanner error={errorObj} />;
  }

  if (isLoading && pageIndex === 1) {
    return (
      <div className="flex justify-center" data-testid="listing-page-spinner">
        <OdsSpinner />
      </div>
    );
  }
  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb rootLabel={appConfig.rootLabel} appName="a-dedicated-3" />
      }
      header={{ title: t('title') }}
    >
      <React.Suspense>
        {columns && flatTmp && (
          <Datagrid
            columns={columns}
            items={flatTmp || []}
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
