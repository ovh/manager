import React, { useEffect, useState } from 'react';
import {
  Datagrid,
  ErrorBanner,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsDivider,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/loading/Loading.component';
import { getListingIcebergV2 } from '@/data/api/hpc-vmware-managed-vcd';
import TDatagridRoute from '@/types/datagrid-route.type';

export type TDatagridContainerProps = {
  route: TDatagridRoute;
  title: string;
  isEmbedded?: boolean;
  containerId: string;
  columns: any[];
};

export default function DatagridContainer({
  title,
  containerId,
  isEmbedded = false,
  route: { api, onboarding },
  columns,
}: TDatagridContainerProps) {
  const [flattenData, setFlattenData] = useState<Record<string, unknown>[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation('listing');

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
    queryKey: [`servicesListingIceberg-${containerId}`],
    queryFn: ({ pageParam }) =>
      getListingIcebergV2({
        pageSize,
        cursor: pageParam,
        route: api,
      }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: (lastPage) => lastPage.cursorNext,
  });

  useEffect(() => {
    if (status === 'success' && data?.pages[0].data.length === 0) {
      navigate(onboarding);
    }
    const flatten = data?.pages.map((page: any) => page.data).flat();
    setFlattenData(flatten ?? []);
  }, [data]);

  if (isError) {
    return <ErrorBanner error={error.response} />;
  }

  if (isLoading && !flattenData.length) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const layoutCss = `px-10 pt-${!isEmbedded ? '5' : '0'}`;

  return (
    <div className={layoutCss}>
      <div className="flex items-center justify-between mt-4">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.text}
          data-testid="DatagridContainer--title"
        >
          {title}
        </OsdsText>
      </div>
      <OsdsDivider />
      <React.Suspense>
        {flattenData.length && (
          <Datagrid
            columns={columns}
            items={flattenData}
            totalItems={0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortChange={setSorting}
            contentAlignLeft
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
              {t('managed_vcd_listing_load_more')}
            </OsdsButton>
          </div>
        )}
      </div>
    </div>
  );
}
