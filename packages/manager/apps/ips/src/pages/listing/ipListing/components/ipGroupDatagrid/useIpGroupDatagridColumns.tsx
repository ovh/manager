import React from 'react';

import { useTranslation } from 'react-i18next';

import { DatagridColumn } from '@ovh-ux/manager-react-components';

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
    isLoading: isMitigationLoading,
  } = useGetIpMitigationWithoutIceberg({
    ip: parentIp,
  });

  const { vmacsWithIp, isLoading: isVmacsLoading } = useGetIpVmacWithIp({
    serviceName,
  });

  const columns: DatagridColumn<string>[] = [
    {
      id: 'ip',
      label: t('listingColumnsIp'),
      cell: (ip: string) => {
        return <IpCell ip={ip} parentIpGroup={parentIp}></IpCell>;
      },
      size: parentHeaders?.current.ip?.clientWidth,
    },
    {
      id: 'ip-type',
      label: t('listingColumnsIpType'),
      cell: () => <IpType ip={parentIp} />,
      size: parentHeaders?.current['ip-type']?.clientWidth,
    },
    {
      id: 'ip-alerts',
      label: t('listingColumnsIpAlerts'),
      cell: (ip) => (
        <IpAlerts subIp={ip} ip={parentIp} isByoipSlice={isByoipSlice} />
      ),
      size: parentHeaders?.current['ip-alerts']?.clientWidth,
    },
    {
      id: 'ip-region',
      label: t('listingColumnsIpRegion'),
      cell: () => <IpRegion ip={parentIp} />,
      size: parentHeaders?.current['ip-region']?.clientWidth,
    },
    {
      id: 'ip-country',
      label: t('listingColumnsIpCountry'),
      cell: () => <IpCountry ip={parentIp} />,
      size: parentHeaders?.current['ip-country']?.clientWidth,
    },
    {
      id: 'ip-attached-service',
      label: t('listingColumnsIpAttachedService'),
      cell: () => <IpAttachedService ip={parentIp} />,
      size: parentHeaders?.current['ip-attached-service']?.clientWidth,
    },
    {
      id: 'ip-reverse',
      label: t('listingColumnsIpReverseDNS'),
      cell: (ip: string) => <IpReverse ip={ip} parentIpGroup={parentIp} />,
      size: parentHeaders?.current['ip-reverse']?.clientWidth,
    },
    {
      id: 'ip-vmac',
      label: t('listingColumnsIpVMac'),
      cell: (ip: string) => (
        <IpVmacFilterByIp
          ip={ip}
          vmacsWithIp={vmacsWithIp}
          isLoading={isVmacsLoading}
        />
      ),
      size: parentHeaders?.current['ip-vmac']?.clientWidth,
    },
    {
      id: 'ip-ddos',
      label: t('listingColumnsIpAntiDDos'),
      cell: (ip: string) => (
        <IpAntiDdosDisplay
          ipMitigation={ipMitigation}
          enabled={!!isAntiDdosAvailable}
          ip={ip}
        />
      ),
      size: parentHeaders?.current['ip-ddos']?.clientWidth,
    },
    {
      id: 'ip-edge-firewall',
      label: t('listingColumnsIpEdgeFirewall'),
      cell: (ip: string) => <IpEdgeFirewall ip={parentIp} ipOnFirewall={ip} />,
      size: parentHeaders?.current['ip-edge-firewall']?.clientWidth,
    },
    {
      id: 'ip-game-firewall',
      label: t('listingColumnsIpGameFirewall'),
      cell: (ip: string) => (
        <IpGameFirewallDisplay
          ip={parentIp}
          ipOnGame={ip}
          enabled={!!isGameFirewallAvailable}
        />
      ),
      size: parentHeaders?.current['ip-game-firewall']?.clientWidth,
    },
    {
      id: 'action',
      label: '',
      cell: (ip: string) => (
        <IpActionsCell
          parentIpGroup={parentIp}
          ip={ip}
          isByoipSlice={isByoipSlice}
        />
      ),
      size: parentHeaders?.current.action?.clientWidth,
    },
  ];

  return {
    columns,
    isLoading: isMitigationLoading || isVmacsLoading,
  };
};
