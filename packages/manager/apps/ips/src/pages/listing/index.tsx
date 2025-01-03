import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Datagrid,
  DataGridTextCell,
  useResourcesIcebergV6,
  BaseLayout,
  ErrorBanner,
} from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import Loading from '@/components/Loading/Loading';
import { urls } from '@/routes/routes.constant';

export default function Listing() {
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
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
  } = useResourcesIcebergV6<any>({
    route: `/ip`,
    queryKey: ['ips', `/ip`],
  });

  if (!isLoading && flattenData?.length === 0) {
    navigate(urls.onboarding);
  }

  useEffect(() => {
    if (columns && status === 'success' && flattenData?.length > 0) {
      const newColumns = Object.keys(flattenData[0])
        .filter((element) => element !== 'iam')
        .map((element) => ({
          id: element,
          label: element,
          type: 'string',
          cell: (props: any) => {
            const label = props[element] as string;
            if (typeof label === 'string' || typeof label === 'number') {
              return <DataGridTextCell>{label}</DataGridTextCell>;
            }
            return <div>-</div>;
          },
        }));
      setColumns(newColumns);
    }
  }, [flattenData]);

  if (isError) {
    return <ErrorBanner error={error as ApiError} />;
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
    <BaseLayout header={header}>
      <OdsButton
        className="mb-5"
        variant={ODS_BUTTON_VARIANT.outline}
        icon={ODS_ICON_NAME.plus}
        onClick={() => navigate(urls.order)}
        label={t('orderIps')}
      />
      <React.Suspense fallback={<Loading />}>
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
