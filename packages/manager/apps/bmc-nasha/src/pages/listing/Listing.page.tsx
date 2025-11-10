import { useMemo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { BaseLayout, Datagrid, type DatagridColumn } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useNavigationGetUrl,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import type { NashaService } from '@/types/Nasha.type';

import ServiceNameCell from '@/components/listing/ServiceNameCell.component';
import CanCreatePartitionCell from '@/components/listing/CanCreatePartitionCell.component';
import CustomNameCell from '@/components/listing/CustomNameCell.component';
import DatacenterCell from '@/components/listing/DatacenterCell.component';
import DiskTypeCell from '@/components/listing/DiskTypeCell.component';

export default function ListingPage() {
  const { t } = useTranslation(['common', 'listing']);
  const { trackClick } = useOvhTracking();
  const { data: orderUrl } = useNavigationGetUrl(['dedicated', '#/nasha/order', {}]);

  // Fetch data with Iceberg API (like AngularJS module does)
  // Using fetchIcebergV6 directly to avoid useDataRetrievalOperations infinite loop
  const { data, isLoading } = useQuery({
    queryKey: ['listing', APP_FEATURES.listingEndpoint],
    queryFn: () =>
      fetchIcebergV6<NashaService>({
        route: APP_FEATURES.listingEndpoint,
        pageSize: 25,
      }),
    select: (response) => ({
      flattenData: Array.isArray(response?.data) ? response.data : [],
      totalCount: response?.totalCount || 0,
    }),
  });

  const flattenData = data?.flattenData || [];
  const totalCount = data?.totalCount || 0;


  // Define stable cell renderers with useCallback to prevent infinite loops
  const renderServiceName = useCallback(
    (row: NashaService) => <ServiceNameCell serviceName={row.serviceName} />,
    [],
  );
  const renderCanCreatePartition = useCallback(
    (row: NashaService) => (
      <CanCreatePartitionCell canCreatePartition={row.canCreatePartition} />
    ),
    [],
  );
  const renderCustomName = useCallback(
    (row: NashaService) => <CustomNameCell customName={row.customName} />,
    [],
  );
  const renderDatacenter = useCallback(
    (row: NashaService) => <DatacenterCell datacenter={row.datacenter} />,
    [],
  );
  const renderDiskType = useCallback(
    (row: NashaService) => <DiskTypeCell diskType={row.diskType} />,
    [],
  );

  // Define columns with cell renderers and labels for Datagrid
  // Removed isSortable, isSearchable, isFilterable to prevent infinite loops
  const columns = useMemo<DatagridColumn<NashaService>[]>(
    () => [
      {
        id: 'serviceName',
        label: t('listing:columns.serviceName'),
        cell: renderServiceName,
        enableHiding: true,
      },
      {
        id: 'canCreatePartition',
        label: t('listing:columns.canCreatePartition'),
        cell: renderCanCreatePartition,
        enableHiding: true,
      },
      {
        id: 'customName',
        label: t('listing:columns.customName'),
        cell: renderCustomName,
        enableHiding: true,
      },
      {
        id: 'datacenter',
        label: t('listing:columns.datacenter'),
        cell: renderDatacenter,
        enableHiding: true,
      },
      {
        id: 'diskType',
        label: t('listing:columns.diskType'),
        cell: renderDiskType,
        enableHiding: true,
      },
    ],
    [t, renderServiceName, renderCanCreatePartition, renderCustomName, renderDatacenter, renderDiskType],
  );

  // Handle order button click
  const handleOrderClick = useCallback(() => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'listing', 'add'],
    });
    if (orderUrl) {
      window.location.href = orderUrl as string;
    }
  }, [trackClick, orderUrl]);

  // Topbar CTA button
  const topbarCTA = useMemo(
    () => (
      <button
        type="button"
        onClick={handleOrderClick}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
      >
        {t('listing:order_button')}
      </button>
    ),
    [t, handleOrderClick],
  );

  return (
    <BaseLayout
      header={{
        title: t('listing:title'),
        changelogButton: true,
        guideMenu: true,
      }}
    >
      <Datagrid
        columns={columns}
        data={flattenData}
        totalCount={totalCount}
        isLoading={isLoading}
        topbar={topbarCTA}
      />
    </BaseLayout>
  );
}
