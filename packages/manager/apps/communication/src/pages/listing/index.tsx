import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { FilterCategories } from '@ovh-ux/manager-core-api';
// import { useNavigate, useLocation } from 'react-router-dom';

import { OdsSpinner } from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  // DataGridTextCell,
  ErrorBanner,
  useResourcesV6,
  // dataType,
  BaseLayout,
} from '@ovh-ux/manager-react-components';

// import appConfig from '@/communication.config';

export default function Listing() {
  // const myConfig = appConfig;
  // const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const [columns, setColumns] = useState<any>([]);
  // const navigate = useNavigate();
  // const location = useLocation();
  const { t } = useTranslation('listing');
  const {
    flattenData,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    search,
    sorting,
    setSorting,
    filters,
  } = useResourcesV6({
    columns,
    route: `/me/notification/email/history`,
    queryKey: ['communication', `/me/notification/email/history`],
  });

  // const navigateToDashboard = (label: string) => {
  //   const path =
  //     location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
  //   startTransition(() => navigate(`${path}${label}`));
  // };

  // Code to remove
  // const comparatorType = {
  //   Number: FilterCategories.Numeric,
  //   Date: FilterCategories.Date,
  //   String: FilterCategories.String,
  //   Boolean: FilterCategories.Boolean,
  //   Options: FilterCategories.Options,
  // };

  // Code to remove and declare definition columns in const variable
  // useEffect(() => {
  //   if (
  //     columns.length === 0 &&
  //     status === 'success' &&
  //     flattenData?.length > 0
  //   ) {
  //     const newColumns = Object.keys(flattenData[0] as object)
  //       .filter((element) => element !== 'iam')
  //       .map((element) => ({
  //         id: element,
  //         label: element,
  //         isFilterable: true,
  //         isSearchable: true,
  //         // @ts-ignore
  //         type: dataType(flattenData[0][element]),
  //         // @ts-ignore
  //         ...(comparatorType[dataType(flattenData[0][element])] && {
  //           // @ts-ignore
  //           comparator: comparatorType[dataType(flattenData[0][element])],
  //         }),
  //         cell: (props: any) => {
  //           const label = props[element] as string;
  //           if (typeof label === 'string' || typeof label === 'number') {
  //             if (serviceKey === element)
  //               return (
  //                 <DataGridTextCell>
  //                   <OdsButton
  //                     variant={ODS_BUTTON_VARIANT.ghost}
  //                     onClick={() => navigateToDashboard(label)}
  //                     label={label}
  //                   />
  //                 </DataGridTextCell>
  //               );
  //             return <DataGridTextCell>{label}</DataGridTextCell>;
  //           }
  //           return <div>-</div>;
  //         },
  //       }));
  //     setColumns(newColumns);
  //   }
  // }, [flattenData]);

  if (isError) {
    const { response }: any = error;
    const errorObj = {
      data: error,
      headers: response.headers,
      status: response.status,
    };
    return <ErrorBanner error={errorObj} />;
  }

  if (isLoading) {
    return (
      <div
        className="flex justify-center"
        data-testid="listing-spinner-container"
      >
        <OdsSpinner />
      </div>
    );
  }

  const header = {
    title: t('title'),
  };

  return (
    <BaseLayout header={header}>
      <React.Suspense>
        {columns && (
          <Datagrid
            columns={columns}
            items={flattenData || []}
            totalItems={totalCount || 0}
            hasNextPage={hasNextPage && !isLoading}
            onFetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortChange={setSorting}
            isLoading={isLoading}
            filters={filters}
            search={search}
          />
        )}
      </React.Suspense>
    </BaseLayout>
  );
}
