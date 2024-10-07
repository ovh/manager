import {
  Datagrid,
  ErrorBanner,
  Subtitle,
  Title,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';
import { OsdsDivider } from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/loading/Loading.component';
import TDatagridRoute from '@/types/datagrid-route.type';
import { useAutoRefetch } from '@/data/hooks/useAutoRefetch';
import {
  hasResourceUpdatingTargetSpec,
  UpdatableResource,
} from '@/utils/refetchConditions';
import { icebergListingQueryKey } from '@/utils/queryKeys';

export type TDatagridContainerProps = {
  route: TDatagridRoute;
  title: string;
  isEmbedded?: boolean;
  queryKey: string[];
  columns: any[];
  orderButton?: React.JSX.Element;
};

export default function DatagridContainer({
  title,
  queryKey,
  isEmbedded = false,
  route: { api, onboarding },
  columns,
  orderButton,
}: Readonly<TDatagridContainerProps>) {
  const [flattenData, setFlattenData] = useState<Record<string, unknown>[]>([]);
  const navigate = useNavigate();
  const listingQueryKey = [...queryKey, icebergListingQueryKey];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    error,
    status,
    sorting,
    setSorting,
  } = useResourcesIcebergV2({
    route: api,
    queryKey: listingQueryKey,
  });

  useAutoRefetch({
    queryKey: listingQueryKey,
    enabled: hasResourceUpdatingTargetSpec(
      (flattenData as unknown) as UpdatableResource[],
    ),
    interval: 4000,
  });

  useEffect(() => {
    if (
      status === 'success' &&
      data?.pages[0].data.length === 0 &&
      onboarding
    ) {
      navigate(onboarding);
    }
    const flatten = data?.pages.map((page: any) => page.data).flat();
    setFlattenData(flatten ?? []);
  }, [data]);

  if (isError) {
    // return <ErrorBanner error={error} />;
    // TODO temporary fix
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: { message: 'An error occured while fetching data' },
        }}
      />
    );
  }

  if (isLoading && !flattenData.length) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const layoutCss = `px-10 pt-${isEmbedded ? '0' : '5'}`;

  const header = isEmbedded ? (
    <Subtitle>{title}</Subtitle>
  ) : (
    <Title>{title}</Title>
  );

  return (
    <div className={layoutCss}>
      <div className="flex items-center justify-between mt-4">{header}</div>
      <OsdsDivider />
      {orderButton && <div className="w-fit mb-8">{orderButton}</div>}
      <React.Suspense>
        {flattenData.length && (
          <Datagrid
            columns={columns}
            items={flattenData}
            totalItems={0}
            onFetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage && !isLoading}
            sorting={sorting}
            onSortChange={setSorting}
            manualSorting={false}
            contentAlignLeft
          />
        )}
      </React.Suspense>
    </div>
  );
}
