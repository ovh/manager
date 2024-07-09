import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import {
  Datagrid,
  DataGridTextCell,
  Links,
  LinkType,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';

import { getListingIcebergV2 } from '@/data/api/hpc-vmware-managed-vcd';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import ErrorBanner from '@/components/error/Error.component';
import Loading from '@/components/loading/Loading.component';

import RegionLabel from '@/components/region-label/RegionLabel.component';
import { urls } from '@/routes/routes.constant';
import IVcdOrganization from '@/types/vcd-organization.interface';

export default function Listing() {
  const { t } = useTranslation('listing');
  const [flattenData, setFlattenData] = useState([]);
  const navigate = useNavigate();
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
    queryKey: [`servicesListingIceberg`],
    queryFn: ({ pageParam }) =>
      getListingIcebergV2({ pageSize, cursor: pageParam }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: (lastPage) => lastPage.cursorNext as any,
  });

  const navigateToDashboard = (label: string) => {
    navigate(`/${label}`);
  };

  const gridColumns = [
    {
      id: 'name',
      cell: (vdcOrg: IVcdOrganization) => (
        <DataGridTextCell>
          <Links
            onClickReturn={() => navigateToDashboard(vdcOrg.id)}
            label={vdcOrg.currentState?.fullName}
          ></Links>
        </DataGridTextCell>
      ),
      label: t('managed_vcd_listing_name'),
    },
    {
      id: 'location',
      cell: (vdcOrg: IVcdOrganization) => (
        <DataGridTextCell>
          <RegionLabel code={vdcOrg.currentState?.region} />
        </DataGridTextCell>
      ),
      label: t('managed_vcd_listing_location'),
    },
    {
      id: 'description',
      cell: (vdcOrg: IVcdOrganization) => (
        <DataGridTextCell>{vdcOrg.currentState?.description}</DataGridTextCell>
      ),
      label: t('managed_vcd_listing_description'),
    },
    {
      id: 'webInterfaceURL',
      cell: (vdcOrg: IVcdOrganization) => (
        <DataGridTextCell>
          <Links
            href={vdcOrg.currentState?.webInterfaceUrl}
            type={LinkType.external}
            label={vdcOrg.currentState?.webInterfaceUrl}
          />
        </DataGridTextCell>
      ),
      label: t('managed_vcd_listing_web_interface_url'),
    },
  ];

  useEffect(() => {
    if (status === 'success' && data?.pages[0].data.length === 0) {
      navigate(urls.onboarding);
    }
    const flatten = data?.pages.map((page: any) => page.data).flat();
    setFlattenData(flatten);
  }, [data]);

  if (isError) {
    return <ErrorBanner error={error.response} />;
  }

  if (isLoading && !flattenData) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-10 pt-5">
      <div className="flex items-center justify-between mt-4">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('managed_vcd_listing_title')}
        </OsdsText>
      </div>
      <OsdsDivider />
      <React.Suspense>
        {flattenData && (
          <Datagrid
            columns={gridColumns}
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
