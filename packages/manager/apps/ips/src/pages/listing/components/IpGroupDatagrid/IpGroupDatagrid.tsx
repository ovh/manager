import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '@tanstack/react-table';
import {
  ActionsCell,
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
import { useGetIpReverse } from '@/data/hooks/ip';
import { ListingContext } from '../../listingContext';

export const IpGroupDatagrid = ({
  row,
  parentHeaders,
}: {
  row: Row<string>;
  parentHeaders: React.MutableRefObject<any>;
}) => {
  const { ipToSearch } = useContext(ListingContext);
  const [paginatedIpList, setPaginatedIpList] = useState<string[]>([]);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const [filteredIpList, setFilteredIpList] = useState<string[]>([]);

  const pageSize = 10;
  const { t } = useTranslation('listing');

  const { ipReverse: ipReverseList } = useGetIpReverse({ ip: row.original });

  const columns: DatagridColumn<string>[] = [
    {
      id: 'ip',
      label: t('listingColumnsIp'),
      cell: (ip: string) => {
        return <IpCell ip={ip}></IpCell>;
      },
      size: parentHeaders.current.ip.clientWidth,
    },
    {
      id: 'ip-type',
      label: t('listingColumnsIpType'),
      cell: () => {
        return <IpType ip={row.original}></IpType>;
      },
      size: parentHeaders.current['ip-type'].clientWidth,
    },
    {
      id: 'ip-alerts',
      label: t('listingColumnsIpAlerts'),
      cell: () => {
        return <IpAlerts ip={row.original}></IpAlerts>;
      },
      size: parentHeaders.current['ip-alerts'].clientWidth,
    },
    {
      id: 'ip-region',
      label: t('listingColumnsIpRegion'),
      cell: () => {
        return <IpRegion ip={row.original}></IpRegion>;
      },
      size: parentHeaders.current['ip-region'].clientWidth,
    },
    {
      id: 'ip-country',
      label: t('listingColumnsIpCountry'),
      cell: () => {
        return <IpCountry ip={row.original}></IpCountry>;
      },
      size: parentHeaders.current['ip-country'].clientWidth,
    },
    {
      id: 'ip-attached-service',
      label: t('listingColumnsIpAttachedService'),
      cell: () => {
        return <IpAttachedService ip={row.original}></IpAttachedService>;
      },
      size: parentHeaders.current['ip-attached-service'].clientWidth,
    },
    {
      id: 'ip-reverse',
      label: t('listingColumnsIpReverseDNS'),
      cell: (ip: string) => {
        return <IpReverse ip={ip}></IpReverse>;
      },
      size: parentHeaders.current['ip-reverse'].clientWidth,
    },
    {
      id: 'ip-vmac',
      label: t('listingColumnsIpVMac'),
      cell: (ip: string) => {
        return <IpVmac ip={ip}></IpVmac>;
      },
      size: parentHeaders.current['ip-vmac'].clientWidth,
    },
    {
      id: 'ip-ddos',
      label: t('listingColumnsIpAntiDDos'),
      cell: (ip: string) => {
        return <IpAntiDdos ip={ip}></IpAntiDdos>;
      },
      size: parentHeaders.current['ip-ddos'].clientWidth,
    },
    {
      id: 'ip-edge-firewall',
      label: t('listingColumnsIpEdgeFirewall'),
      cell: (ip: string) => {
        return <IpEdgeFirewall ip={ip}></IpEdgeFirewall>;
      },
      size: parentHeaders.current['ip-edge-firewall'].clientWidth,
    },
    {
      id: 'ip-game-firewall',
      label: t('listingColumnsIpGameFirewall'),
      cell: (ip: string) => {
        return <IpGameFirewall ip={ip}></IpGameFirewall>;
      },
      size: parentHeaders.current['ip-game-firewall'].clientWidth,
    },
    {
      id: 'action',
      label: '',
      cell: (ip: string) => <ActionsCell ip={ip} />,
      size: parentHeaders.current.action.clientWidth,
    },
  ];

  // row
  //   .getVisibleCells()
  //   .find((cell) => cell.id === `${row.index}_action`)
  //   .column.getSize()

  useEffect(() => {
    if (!ipReverseList) return;
    const filtered = ipToSearch
      ? ipReverseList
          .filter((ip) => ip.ipReverse.indexOf(ipToSearch) !== -1)
          .map((ip) => ip.ipReverse)
      : ipReverseList.map((ip) => ip.ipReverse);
    setFilteredIpList(filtered);
    setPaginatedIpList(filtered.slice(0, pageSize * numberOfPageDisplayed));
  }, [ipReverseList, numberOfPageDisplayed, ipToSearch]);

  const loadMoreIps = () => {
    setNumberOfPageDisplayed(numberOfPageDisplayed + 1);
  };

  return (
    <Datagrid
      columns={columns}
      items={paginatedIpList}
      totalItems={filteredIpList?.length}
      hasNextPage={numberOfPageDisplayed * pageSize < filteredIpList?.length}
      onFetchNextPage={loadMoreIps}
      hideHeader={true}
      tableLayoutFixed={true}
    />
  );
};
