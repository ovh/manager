import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/muk';

import {
  IpActionsCell,
  IpAntiDdos,
  IpAttachedService,
  IpCell,
  IpCountry,
  IpEdgeFirewall,
  IpGameFirewall,
  IpRegion,
  IpReverse,
  IpType,
  IpVmac,
} from '../DatagridCells';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { IpRowData } from '../DatagridCells/enableCellsUtils';

export const useIpDatagridColumns = (): DatagridColumn<IpRowData>[] => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);

  return [
    {
      id: 'ip',
      accessorKey: 'ip',
      header: t('listingColumnsIp'),
      enableHiding: false,
      size: 200,
      cell: IpCell,
    },
    {
      id: 'ip-type',
      accessorKey: 'ip',
      header: t('listingColumnsIpType'),
      enableHiding: true,
      cell: IpType,
    },
    {
      id: 'ip-region',
      accessorKey: 'ip',
      header: t('listingColumnsIpRegion'),
      enableHiding: true,
      size: 140,
      cell: IpRegion,
    },
    {
      id: 'ip-country',
      accessorKey: 'ip',
      header: t('listingColumnsIpCountry'),
      enableHiding: true,
      size: 100,
      cell: IpCountry,
    },
    {
      id: 'ip-attached-service',
      accessorKey: 'ip',
      header: t('listingColumnsIpAttachedService'),
      enableHiding: true,
      cell: IpAttachedService,
    },
    {
      id: 'ip-reverse',
      accessorKey: 'ip',
      header: t('listingColumnsIpReverseDNS'),
      enableHiding: true,
      cell: IpReverse,
    },
    {
      id: 'ip-vmac',
      accessorKey: 'ip',
      header: t('listingColumnsIpVMac'),
      enableHiding: true,
      cell: IpVmac,
    },
    {
      id: 'ip-ddos',
      accessorKey: 'ip',
      header: t('listingColumnsIpAntiDDos'),
      enableHiding: true,
      size: 100,
      cell: IpAntiDdos,
    },
    {
      id: 'ip-edge-firewall',
      accessorKey: 'ip',
      header: t('listingColumnsIpEdgeFirewall'),
      enableHiding: true,
      size: 80,
      cell: IpEdgeFirewall,
    },
    {
      id: 'ip-game-firewall',
      accessorKey: 'ip',
      header: t('listingColumnsIpGameFirewall'),
      enableHiding: true,
      size: 80,
      cell: IpGameFirewall,
    },
    {
      id: 'action',
      accessorKey: 'ip',
      header: '',
      enableHiding: false,
      size: 50,
      cell: IpActionsCell,
    },
  ];
};
