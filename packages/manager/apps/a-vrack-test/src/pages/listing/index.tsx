import React, { useState, useEffect, HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { ColumnDef } from '@tanstack/react-table';

import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import {
  BaseLayout,
  Datagrid,
  DataGridTextCell,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';

import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

import appConfig from '@/a-vrack-test.config';
import { urls } from '@/routes/routes.constant';

export type Vrack = {
  id: string;
  region: string;
  kmipEndpoint: string;
};

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}

export default function Listing() {
  const { t } = useTranslation('listing');
  const myConfig = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  // const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    flattenData,
    isError,
    isLoading,
    sorting,
    setSorting,
    error,
    status,
  } = useResourcesIcebergV2({
    route: `/okms/resource`,
    queryKey: ['a-vrack-test', `/okms/resource`],
  });

  const navigateToDashboard = (label: string) => {
    let path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    navigate(`${path}${label}`);
  };

  const [flattenDataTmp, setFlattenDataTmp] = useState([]);

  useEffect(() => {
    if (status === 'success' && data?.pages[0].data.length === 0) {
      navigate(urls.onboarding);
    }
    //  else if (status === 'success' && data?.pages.length > 0 && !flattenData) {
    //   // const tmp = Object.keys(data?.pages[0].data[0])
    //   //   .filter((element) => element !== 'iam')
    //   //   .map((element) => ({
    //   //     id: element,
    //   //     label: element,
    //   //     cell: (props: any) => {
    //   //       const label = props[element] as string;
    //   //       if (typeof label === 'string' || typeof label === 'number') {
    //   //         if (serviceKey === element)
    //   //           return (
    //   //             <DataGridTextCell>
    //   //               <OdsButton
    //   //                 variant={ODS_BUTTON_VARIANT.ghost}
    //   //                 onClick={() => navigateToDashboard(label)}
    //   //                 label={label}
    //   //               />
    //   //             </DataGridTextCell>
    //   //           );
    //   //         return <DataGridTextCell>{label}</DataGridTextCell>;
    //   //       }
    //   //       return <div>-</div>;
    //   //     },
    //   //   }));
    //   // setColumns(tmp);
    // }
  }, [data]);

  // const columns: ColumnDef<Vrack>[] = [
  const columns = [
    {
      id: 'id',
      label: 'id',
      accessorKey: 'id',
      cell: ({ row, getValue }: any) => {
        console.info('***************************');
        console.info('a-vrack id row : ', row);
        console.info('a-vrack id getValue : ', getValue);
        console.info('row.getCanExpand() : ', row.getCanExpand());
        // return (
        //   <div>
        //     <span>{row?.original?.id}</span>
        //     {/* <span>{getValue('id')}</span> */}
        //   </div>
        // );
        return (
          <div
            style={{
              // Since rows are flattened by default,
              // we can use the row.depth property
              // and paddingLeft to visually indicate the depth
              // of the row
              paddingLeft: `${row?.depth * 2}rem`,
            }}
          >
            <div>
              <IndeterminateCheckbox
                {...{
                  checked: row?.getIsSelected(),
                  indeterminate: row?.getIsSomeSelected(),
                  onChange: row?.getToggleSelectedHandler(),
                }}
              />{' '}
              {row?.getCanExpand() ? (
                <button
                  {...{
                    onClick: row?.getToggleExpandedHandler(),
                    style: { cursor: 'pointer' },
                  }}
                >
                  {row?.getIsExpanded() ? '👇' : '👉'}
                </button>
              ) : (
                '🔵'
              )}{' '}
              {getValue('id')}
            </div>
          </div>
        );
      },
    },
    {
      id: 'region',
      accessorKey: 'region',
      label: 'region',
      cell: ({ row, getValue }: any) => (
        <DataGridTextCell>{row.original.region}</DataGridTextCell>
      ),
    },
    {
      id: 'kmipEndpoint',
      accessorKey: 'kmipEndpoint',
      label: 'kmipEndpoint',
      cell: ({ row, getValue }: any) => (
        <DataGridTextCell>{row.original.kmipEndpoint}</DataGridTextCell>
      ),
    },
    // {
    //   id: 'kmipRsaEndpoint',
    //   label: 'kmipRsaEndpoint',
    //   cell: (props: any) => (
    //     <DataGridTextCell>{props.kmipRsaEndpoint}</DataGridTextCell>
    //   ),
    // },
    // {
    //   id: 'restEndpoint',
    //   label: 'restEndpoint',
    //   cell: (props: any) => (
    //     <DataGridTextCell>{props.restEndpoint}</DataGridTextCell>
    //   ),
    // },
    // {
    //   id: 'swaggerEndpoint',
    //   label: 'swaggerEndpoint',
    //   cell: (props: any) => (
    //     <DataGridTextCell>{props.swaggerEndpoint}</DataGridTextCell>
    //   ),
    // },
    // {
    //   id: 'serviceKeyCount',
    //   label: 'serviceKeyCount',
    //   cell: (props: any) => (
    //     <DataGridTextCell>{props.serviceKeyCount}</DataGridTextCell>
    //   ),
    // },
  ];

  // add Subrow dynamicly
  useEffect(() => {
    if (flattenData) {
      const tmp = flattenData.map((element: any, index) => {
        return {
          ...element,
          subRows: [
            {
              id: `test id ${index}`,
              region: `test region ${index}`,
              kmipEndpoint: `test kmiEndpoint ${index}`,
            },
          ],
        };
      });
      setFlattenDataTmp(tmp);
    }
  }, [flattenData]);

  if (isError) {
    return <ErrorBanner error={error} />;
  }

  if (isLoading && !flattenDataTmp) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  const header = {
    title: t('title'),
  };

  console.info('a-vrack-test columns : ', columns);
  console.info('a-vrack flattenDataTmp : ', flattenDataTmp);
  return (
    <BaseLayout breadcrumb={<Breadcrumb />} header={header}>
      <React.Suspense>
        {/* {columns && flattenData && ( */}
        {columns && flattenDataTmp && (
          <Datagrid
            columns={columns}
            // items={flattenData || []}
            items={flattenDataTmp || []}
            totalItems={0}
            onFetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage && !isLoading}
            sorting={sorting}
            onSortChange={setSorting}
            manualSorting={false}
          />
        )}
      </React.Suspense>
    </BaseLayout>
  );
}
