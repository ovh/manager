import { useMemo } from 'react';

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

  return useMemo<DatagridColumn<NashaService>[]>(
    () => [
      {
        accessorKey: 'serviceName',
        header: t('listing:columns.serviceName'),
        cell: ({ row }) => <ServiceNameCell serviceName={row.original.serviceName} />,
        enableHiding: true,
      },
      {
        accessorKey: 'canCreatePartition',
        header: t('listing:columns.canCreatePartition'),
        cell: ({ row }) => (
          <CanCreatePartitionCell canCreatePartition={row.original.canCreatePartition} />
        ),
        enableHiding: true,
      },
      {
        accessorKey: 'customName',
        header: t('listing:columns.customName'),
        cell: ({ row }) => <CustomNameCell customName={row.original.customName} />,
        enableHiding: true,
      },
      {
        accessorKey: 'datacenter',
        header: t('listing:columns.datacenter'),
        cell: ({ row }) => <DatacenterCell datacenter={row.original.datacenter} />,
        enableHiding: true,
      },
      {
        accessorKey: 'diskType',
        header: t('listing:columns.diskType'),
        cell: ({ row }) => <DiskTypeCell diskType={row.original.diskType} />,
        enableHiding: true,
      },
      {
        accessorKey: 'monitored',
        header: t('listing:columns.monitored'),
        cell: ({ row }) => {
          const key = row.original.monitored ? 'monitored_true' : 'monitored_false';
          return t(`listing:columns.${key}`);
        },
        enableHiding: true,
        meta: { isHiddenByDefault: true },
      },
      {
        accessorKey: 'zpoolCapacity',
        header: t('listing:columns.zpoolCapacity'),
        cell: ({ row }) => row.original.zpoolCapacity || '-',
        enableHiding: true,
        meta: { isHiddenByDefault: true },
      },
      {
        accessorKey: 'zpoolSize',
        header: t('listing:columns.zpoolSize'),
        cell: ({ row }) => row.original.zpoolSize || '-',
        enableHiding: true,
        meta: { isHiddenByDefault: true },
      },
    ],
    [t],
  );
}
