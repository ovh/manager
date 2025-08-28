import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '@tanstack/react-table';
import {
  IpActionsCell,
  IpAlerts,
  IpAntiDdosDisplay,
  IpAttachedService,
  IpCell,
  IpCountry,
  IpEdgeFirewallDisplay,
  IpGameFirewallDisplay,
  IpRegion,
  IpReverse,
  IpType,
  IpVmacFilterByIp,
} from '../DatagridCells';
import {
  useGetIpEdgeFirewall,
  useGetIpGameFirewall,
  useGetIcebergIpReverse,
  useGetIpVmacWithIp,
  useGetIpdetails,
  useGetIpMitigationWithoutIceberg,
} from '@/data/hooks/ip';
import {
  isAntiDdosEnabled,
  isGameFirewallEnabled,
} from '../DatagridCells/enableCellsUtils';

export const IpGroupDatagrid = ({
  row,
  parentHeaders,
}: {
  row: Row<{ ip: string }>;
  parentHeaders: React.MutableRefObject<Record<string, HTMLTableCellElement>>;
}) => {
  const [paginatedIpList, setPaginatedIpList] = useState<string[]>([]);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);

  const pageSize = 50;
  const { t } = useTranslation('listing');

  const {
    ipsReverse: ipReverseList,
    isLoading: isIpReverseLoading,
  } = useGetIcebergIpReverse({ ip: row.original.ip });
  const { ipDetails, isLoading: isIpDetailsLoading } = useGetIpdetails({
    ip: row.original.ip,
  });
  const {
    ipMitigation,
    isLoading: isMitigationLoading,
  } = useGetIpMitigationWithoutIceberg({
    ip: row.original.ip,
  });
  const {
    ipEdgeFirewall,
    isLoading: isEdgeFirewallLoading,
  } = useGetIpEdgeFirewall({ ip: row.original.ip });
  const {
    ipGameFirewall,
    isLoading: isGameFirewallLoading,
  } = useGetIpGameFirewall({ ip: row.original.ip });
  const { vmacsWithIp, isLoading: isVmacsLoading } = useGetIpVmacWithIp({
    serviceName: ipDetails?.routedTo?.serviceName,
    enabled: !!ipDetails,
  });

  const columns: DatagridColumn<string>[] = [
    {
      id: 'ip',
      label: t('listingColumnsIp'),
      cell: (ip: string) => {
        return <IpCell ip={ip} parentIpGroup={row.original.ip}></IpCell>;
      },
      size: parentHeaders.current.ip.clientWidth,
    },
    {
      id: 'ip-type',
      label: t('listingColumnsIpType'),
      cell: () => <IpType ip={row.original.ip} />,
      size: parentHeaders.current['ip-type'].clientWidth,
    },
    {
      id: 'ip-alerts',
      label: t('listingColumnsIpAlerts'),
      cell: () => <IpAlerts ip={row.original.ip} />,
      size: parentHeaders.current['ip-alerts'].clientWidth,
    },
    {
      id: 'ip-region',
      label: t('listingColumnsIpRegion'),
      cell: () => <IpRegion ip={row.original.ip} />,
      size: parentHeaders.current['ip-region'].clientWidth,
    },
    {
      id: 'ip-country',
      label: t('listingColumnsIpCountry'),
      cell: () => <IpCountry ip={row.original.ip} />,
      size: parentHeaders.current['ip-country'].clientWidth,
    },
    {
      id: 'ip-attached-service',
      label: t('listingColumnsIpAttachedService'),
      cell: () => <IpAttachedService ip={row.original.ip} />,
      size: parentHeaders.current['ip-attached-service'].clientWidth,
    },
    {
      id: 'ip-reverse',
      label: t('listingColumnsIpReverseDNS'),
      cell: (ip: string) => (
        <IpReverse ip={ip} parentIpGroup={row.original.ip} />
      ),
      size: parentHeaders.current['ip-reverse'].clientWidth,
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
      size: parentHeaders.current['ip-vmac'].clientWidth,
    },
    {
      id: 'ip-ddos',
      label: t('listingColumnsIpAntiDDos'),
      cell: (ip: string) => (
        <IpAntiDdosDisplay
          ipMitigation={ipMitigation}
          enabled={isAntiDdosEnabled(ipDetails)}
          ip={ip}
        />
      ),
      size: parentHeaders.current['ip-ddos'].clientWidth,
    },
    {
      id: 'ip-edge-firewall',
      label: t('listingColumnsIpEdgeFirewall'),
      cell: (ip: string) => (
        <IpEdgeFirewallDisplay
          ip={ip}
          ipEdgeFirewall={ipEdgeFirewall?.find(
            (firewall) => firewall.ipOnFirewall === ip,
          )}
        />
      ),
      size: parentHeaders.current['ip-edge-firewall'].clientWidth,
    },
    {
      id: 'ip-game-firewall',
      label: t('listingColumnsIpGameFirewall'),
      cell: (ip: string) => (
        <IpGameFirewallDisplay
          ip={ip}
          ipGameFirewall={ipGameFirewall?.find(
            (firewall) => firewall.ipOnGame === ip,
          )}
          enabled={isGameFirewallEnabled(ipDetails)}
        />
      ),
      size: parentHeaders.current['ip-game-firewall'].clientWidth,
    },
    {
      id: 'action',
      label: '',
      cell: (ip: string) => (
        <IpActionsCell parentIpGroup={row.original.ip} ip={ip} />
      ),
      size: parentHeaders.current.action.clientWidth,
    },
  ];

  useEffect(() => {
    if (!ipReverseList) return;
    const paginated = ipReverseList.map((ip) => ip.ipReverse);
    setPaginatedIpList(paginated.slice(0, pageSize * numberOfPageDisplayed));
  }, [ipReverseList, numberOfPageDisplayed]);

  const loadMoreIps = () => {
    setNumberOfPageDisplayed(numberOfPageDisplayed + 1);
  };

  const isDatagridLoading =
    isVmacsLoading ||
    isEdgeFirewallLoading ||
    isGameFirewallLoading ||
    isIpDetailsLoading ||
    isMitigationLoading ||
    isIpReverseLoading;

  return (
    <Datagrid
      columns={columns}
      items={paginatedIpList}
      totalItems={ipReverseList?.length}
      hasNextPage={numberOfPageDisplayed * pageSize < ipReverseList?.length}
      onFetchNextPage={loadMoreIps}
      hideHeader
      tableLayoutFixed
      isLoading={isDatagridLoading}
      numberOfLoadingRows={1}
    />
  );
};
