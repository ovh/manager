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

export const useIpDatagridColumns = (): DatagridColumn<{ ip: string }>[] => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);

  return [
    {
      id: 'ip',
      accessorKey: 'ip',
      header: t('listingColumnsIp'),
      enableHiding: false,
      cell: ({ row }) => <IpCell ip={row.original.ip} />,
    },
    {
      id: 'ip-type',
      accessorKey: 'ip',
      header: t('listingColumnsIpType'),
      enableHiding: true,
      cell: ({ getValue }) => <IpType ip={getValue() as string} />,
    },
    {
      id: 'ip-alerts',
      accessorKey: 'ip',
      header: t('listingColumnsIpAlerts'),
      enableHiding: false,
      cell: ({ getValue }) => (
        <IpAlerts subIp={getValue() as string} ip={getValue() as string} />
      ),
    },
    {
      id: 'ip-region',
      accessorKey: 'ip',
      header: t('listingColumnsIpRegion'),
      enableHiding: true,
      cell: ({ getValue }) => <IpRegion ip={getValue() as string} />,
    },
    {
      id: 'ip-country',
      accessorKey: 'ip',
      header: t('listingColumnsIpCountry'),
      enableHiding: true,
      cell: ({ getValue }) => <IpCountry ip={getValue() as string} />,
    },
    {
      id: 'ip-attached-service',
      accessorKey: 'ip',
      header: t('listingColumnsIpAttachedService'),
      enableHiding: true,
      cell: ({ getValue }) => <IpAttachedService ip={getValue() as string} />,
    },
    {
      id: 'ip-reverse',
      accessorKey: 'ip',
      header: t('listingColumnsIpReverseDNS'),
      enableHiding: true,
      cell: ({ getValue }) => <IpReverse ip={getValue() as string} />,
    },
    {
      id: 'ip-vmac',
      accessorKey: 'ip',
      header: t('listingColumnsIpVMac'),
      enableHiding: true,
      cell: ({ getValue }) => <IpVmac ip={getValue() as string} />,
    },
    {
      id: 'ip-ddos',
      accessorKey: 'ip',
      header: t('listingColumnsIpAntiDDos'),
      enableHiding: true,
      cell: ({ getValue }) => <IpAntiDdos ip={getValue() as string} />,
    },
    {
      id: 'ip-edge-firewall',
      accessorKey: 'ip',
      header: t('listingColumnsIpEdgeFirewall'),
      enableHiding: true,
      cell: ({ getValue }) => <IpEdgeFirewall ip={getValue() as string} />,
    },
    {
      id: 'ip-game-firewall',
      accessorKey: 'ip',
      header: t('listingColumnsIpGameFirewall'),
      enableHiding: true,
      cell: ({ getValue }) => <IpGameFirewall ip={getValue() as string} />,
    },
    {
      id: 'action',
      accessorKey: 'ip',
      header: 'Actions',
      enableHiding: false,
      size: 40,
      cell: ({ row }) => <IpActionsCell ip={row.original.ip} />,
    },
  ];
};
