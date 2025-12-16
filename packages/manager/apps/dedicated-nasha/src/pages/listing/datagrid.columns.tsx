import { DatagridColumn } from '@ovh-ux/muk';
import { Nasha } from '@/types/nasha.type';
import { useTranslation } from 'react-i18next';
import { Link } from '@ovhcloud/ods-react';

export const useDatagridColumns = (): DatagridColumn<Nasha>[] => {
  const { t } = useTranslation('listing');

  return [
    {
      id: 'serviceName',
      label: t('nasha_directory_columns_header_serviceName'),
      accessorKey: 'serviceName',
      cell: (props) => (
        <Link
          href={`#/${props.row.original.serviceName}`}
        >
          {props.getValue() as string}
        </Link>
      ),
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'canCreatePartition',
      label: t('nasha_directory_columns_header_canCreatePartition'),
      accessorKey: 'canCreatePartition',
      cell: (props) =>
        t(
          `nasha_directory_columns_header_canCreatePartition_${props.getValue()}`,
        ),
      isSortable: true,
    },
    {
      id: 'customName',
      label: t('nasha_directory_columns_header_customName'),
      accessorKey: 'customName',
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'datacenter',
      label: t('nasha_directory_columns_header_datacenter'),
      accessorKey: 'datacenter',
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'diskType',
      label: t('nasha_directory_columns_header_diskType'),
      accessorKey: 'diskType',
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'monitored',
      label: t('nasha_directory_columns_header_monitored'),
      accessorKey: 'monitored',
      cell: (props) =>
        t(`nasha_directory_columns_header_monitored_${props.getValue()}`),
      isSortable: true,
      enableHiding: true,
    },
    {
      id: 'zpoolCapacity',
      label: t('nasha_directory_columns_header_zpoolCapacity'),
      accessorKey: 'zpoolCapacity',
      isSortable: true,
      enableHiding: true,
    },
    {
      id: 'zpoolSize',
      label: t('nasha_directory_columns_header_zpoolSize'),
      accessorKey: 'zpoolSize',
      isSortable: true,
      enableHiding: true,
    },
  ];
};
