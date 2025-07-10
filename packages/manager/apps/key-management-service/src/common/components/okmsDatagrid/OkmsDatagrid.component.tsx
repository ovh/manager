import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  DatagridProps,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import KmsActionMenu from '@/components/menu/KmsActionMenu.component';
import {
  DatagridCellId,
  DatagridCellName,
  DatagridCellRegion,
  DatagridCellStatus,
  DatagridCellKmipCount,
  DatagridCellSecretCount,
  DatagridCellServiceKeyCount,
} from './ListingCells.component';
import { OKMS } from '@/types/okms.type';
import { SERVICE_KEYS_LABEL } from '@/constants';
import { OkmsDatagridType } from './okmsDatagrid.type';

type OkmsDatagridProps = Omit<
  DatagridProps<OKMS>,
  'items' | 'columns' | 'totalItems'
> & {
  type: OkmsDatagridType;
  okmsList: OKMS[];
  isLoading?: boolean;
};

const columnsList: Record<OkmsDatagridType, string[]> = {
  kms: [
    'name',
    'id',
    'kmip_count',
    'servicekey_count',
    'region',
    'status',
    'action',
  ],
  'secret-manager': ['name', 'id', 'secret_count', 'status'],
};

export const OkmsDatagrid = ({
  type = 'secret-manager',
  okmsList,
  ...rest
}: OkmsDatagridProps) => {
  const { t } = useTranslation('key-management-service/listing');

  const columns: DatagridColumn<OKMS>[] = [
    {
      id: 'name',
      cell: (okms: OKMS) => DatagridCellName(okms, type),
      label: t('key_management_service_listing_name_cell'),
    },
    {
      id: 'id',
      cell: DatagridCellId,
      label: t('key_management_service_listing_id_cell'),
    },
    {
      id: 'kmip_count',
      cell: DatagridCellKmipCount,
      label: t('key_management_service_listing_kmip_cell'),
    },
    {
      id: 'servicekey_count',
      cell: DatagridCellServiceKeyCount,
      label: SERVICE_KEYS_LABEL,
    },
    {
      id: 'secret_count',
      cell: DatagridCellSecretCount,
      label: t('key_management_service_listing_secret_cell'),
    },
    {
      id: 'region',
      cell: DatagridCellRegion,
      label: t('key_management_service_listing_region_cell'),
    },
    {
      id: 'status',
      cell: DatagridCellStatus,
      label: t('key_management_service_listing_status_cell'),
    },
    {
      id: 'action',
      cell: KmsActionMenu,
      isSortable: false,
      label: '',
    },
  ];

  return (
    <Datagrid
      columns={columns.filter((column) =>
        columnsList[type].includes(column.id),
      )}
      items={okmsList}
      totalItems={okmsList.length}
      contentAlignLeft
      {...rest}
    />
  );
};
