import { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import type { DatagridColumn } from '@ovh-ux/muk';

import CanCreatePartitionCell from '@/components/listing/CanCreatePartitionCell.component';
import CustomNameCell from '@/components/listing/CustomNameCell.component';
import DatacenterCell from '@/components/listing/DatacenterCell.component';
import DiskTypeCell from '@/components/listing/DiskTypeCell.component';
import ServiceNameCell from '@/components/listing/ServiceNameCell.component';
import type { NashaService } from '@/types/Nasha.type';

export function useListingColumns() {
  const { t } = useTranslation(['listing']);

  // Define stable cell renderers with useCallback to prevent infinite loops
  const renderServiceName = useCallback(
    (row: NashaService) => <ServiceNameCell serviceName={row.serviceName} />,
    [],
  );
  const renderCanCreatePartition = useCallback(
    (row: NashaService) => <CanCreatePartitionCell canCreatePartition={row.canCreatePartition} />,
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

  return useMemo<DatagridColumn<NashaService>[]>(
    () => [
      {
        accessorKey: 'serviceName',
        header: t('listing:columns.serviceName'),
        cell: ({ row }) => renderServiceName(row.original),
        enableHiding: true,
      },
      {
        accessorKey: 'canCreatePartition',
        header: t('listing:columns.canCreatePartition'),
        cell: ({ row }) => renderCanCreatePartition(row.original),
        enableHiding: true,
      },
      {
        accessorKey: 'customName',
        header: t('listing:columns.customName'),
        cell: ({ row }) => renderCustomName(row.original),
        enableHiding: true,
      },
      {
        accessorKey: 'datacenter',
        header: t('listing:columns.datacenter'),
        cell: ({ row }) => renderDatacenter(row.original),
        enableHiding: true,
      },
      {
        accessorKey: 'diskType',
        header: t('listing:columns.diskType'),
        cell: ({ row }) => renderDiskType(row.original),
        enableHiding: true,
      },
    ],
    [
      t,
      renderServiceName,
      renderCanCreatePartition,
      renderCustomName,
      renderDatacenter,
      renderDiskType,
    ],
  );
}
