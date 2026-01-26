import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/muk';

import {
  IpActionsCell,
  IpAlerts,
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
      size: 100,
      cell: IpRegion,
    },
    {
      id: 'ip-country',
      accessorKey: 'ip',
      header: t('listingColumnsIpCountry'),
      enableHiding: true,
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
      cell: IpAntiDdos,
    },
    {
      id: 'ip-edge-firewall',
      accessorKey: 'ip',
      header: t('listingColumnsIpEdgeFirewall'),
      enableHiding: true,
      size: 120,
      cell: IpEdgeFirewall,
    },
    {
      id: 'ip-game-firewall',
      accessorKey: 'ip',
      header: t('listingColumnsIpGameFirewall'),
      enableHiding: true,
      size: 120,
      cell: IpGameFirewall,
    },
    {
      id: 'ip-alerts',
      accessorKey: 'ip',
      header: t('listingColumnsIpAlerts'),
      enableHiding: true,
      size: 100,
      cell: IpAlerts,
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
