import React from 'react';

import { useTranslation } from 'react-i18next';

import { DatagridColumn } from '@ovh-ux/muk';

import {
  useGetIpMitigationWithoutIceberg,
  useGetIpVmacWithIp,
} from '@/data/hooks';

import {
  IpActionsCell,
  IpAlerts,
  IpAntiDdosDisplay,
  IpAttachedService,
  IpCell,
  IpCountry,
  IpEdgeFirewall,
  IpGameFirewallDisplay,
  IpRegion,
  IpReverse,
  IpType,
  IpVmacFilterByIp,
} from '../DatagridCells';

export const useIpGroupDatagridColumns = ({
  parentIp,
  parentHeaders,
  isGameFirewallAvailable,
  isAntiDdosAvailable,
  serviceName,
  isByoipSlice,
}: {
  parentIp: string;
  parentHeaders?: React.MutableRefObject<Record<string, HTMLTableCellElement>>;
  isGameFirewallAvailable?: boolean;
  isAntiDdosAvailable?: boolean;
  serviceName?: string | null;
  isByoipSlice?: boolean;
}) => {
  const { t } = useTranslation('listing');

  const {
    ipMitigation,
    loading: isMitigationLoading,
  } = useGetIpMitigationWithoutIceberg({
    ip: parentIp,
  });

  const { vmacsWithIp, loading: isVmacsLoading } = useGetIpVmacWithIp({
    serviceName,
  });

  const columns: DatagridColumn<{ ip: string }>[] = [
    {
      id: 'ip',
      accessorKey: 'ip',
      label: t('listingColumnsIp'),
      cell: ({ getValue }) => {
        const ip = getValue() as string;
        return <IpCell ip={ip} parentIpGroup={parentIp}></IpCell>;
      },
      size: parentHeaders?.current.ip?.clientWidth,
    },
    {
      id: 'ip-type',
      accessorKey: 'ip',
      label: t('listingColumnsIpType'),
      cell: () => <IpType ip={parentIp} />,
      size: parentHeaders?.current['ip-type']?.clientWidth,
    },
    {
      id: 'ip-alerts',
      accessorKey: 'ip',
      label: t('listingColumnsIpAlerts'),
      cell: ({ getValue }) => (
        <IpAlerts
          subIp={getValue() as string}
          ip={parentIp}
          isByoipSlice={isByoipSlice}
        />
      ),
      size: parentHeaders?.current['ip-alerts']?.clientWidth,
    },
    {
      id: 'ip-region',
      accessorKey: 'ip',
      label: t('listingColumnsIpRegion'),
      cell: () => <IpRegion ip={parentIp} />,
      size: parentHeaders?.current['ip-region']?.clientWidth,
    },
    {
      id: 'ip-country',
      accessorKey: 'ip',
      label: t('listingColumnsIpCountry'),
      cell: () => <IpCountry ip={parentIp} />,
      size: parentHeaders?.current['ip-country']?.clientWidth,
    },
    {
      id: 'ip-attached-service',
      accessorKey: 'ip',
      label: t('listingColumnsIpAttachedService'),
      cell: () => <IpAttachedService ip={parentIp} />,
      size: parentHeaders?.current['ip-attached-service']?.clientWidth,
    },
    {
      id: 'ip-reverse',
      accessorKey: 'ip',
      label: t('listingColumnsIpReverseDNS'),
      cell: ({ getValue }) => (
        <IpReverse ip={getValue() as string} parentIpGroup={parentIp} />
      ),
      size: parentHeaders?.current['ip-reverse']?.clientWidth,
    },
    {
      id: 'ip-vmac',
      accessorKey: 'ip',
      label: t('listingColumnsIpVMac'),
      cell: ({ getValue }) => (
        <IpVmacFilterByIp
          ip={getValue() as string}
          vmacsWithIp={vmacsWithIp}
          loading={isVmacsLoading}
        />
      ),
      size: parentHeaders?.current['ip-vmac']?.clientWidth,
    },
    {
      id: 'ip-ddos',
      accessorKey: 'ip',
      label: t('listingColumnsIpAntiDDos'),
      cell: () => (
        <IpAntiDdosDisplay
          ipMitigation={ipMitigation}
          enabled={!!isAntiDdosAvailable}
        />
      ),
      size: parentHeaders?.current['ip-ddos']?.clientWidth,
    },
    {
      id: 'ip-edge-firewall',
      accessorKey: 'ip',
      label: t('listingColumnsIpEdgeFirewall'),
      cell: ({ getValue }) => (
        <IpEdgeFirewall ip={parentIp} ipOnFirewall={getValue() as string} />
      ),
      size: parentHeaders?.current['ip-edge-firewall']?.clientWidth,
    },
    {
      id: 'ip-game-firewall',
      accessorKey: 'ip',
      label: t('listingColumnsIpGameFirewall'),
      cell: ({ getValue }) => (
        <IpGameFirewallDisplay
          ip={parentIp}
          ipOnGame={getValue() as string}
          enabled={!!isGameFirewallAvailable}
        />
      ),
      size: parentHeaders?.current['ip-game-firewall']?.clientWidth,
    },
    {
      id: 'action',
      accessorKey: 'ip',
      label: '',
      cell: ({ getValue }) => (
        <IpActionsCell
          parentIpGroup={parentIp}
          ip={getValue() as string}
          isByoipSlice={isByoipSlice}
        />
      ),
      size: parentHeaders?.current.action?.clientWidth,
    },
  ];

  return {
    columns,
    loading: isMitigationLoading || isVmacsLoading,
  };
};
