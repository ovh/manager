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

export const IpGroupDatagrid = ({ row }: { row: Row<string> }) => {
  const { ipToSearch } = useContext(ListingContext);
  const [paginatedIpList, setPaginatedIpList] = useState<string[]>([]);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const [filteredIpList, setFilteredIpList] = useState<string[]>([]);

  const pageSize = 10;
  const { t } = useTranslation('listing');

  // const { ipList, isLoading, error, isError } = useGetIpList(apiFilter);
  const { ipReverse: ipReverseList } = useGetIpReverse({ ip: row.original });

  const columns: DatagridColumn<string>[] = [
    {
      id: 'ip',
      label: t('listingColumnsIp'),
      cell: (ip: string) => {
        return <IpCell ip={ip}></IpCell>;
      },
    },
    {
      id: 'ip-type',
      label: t('listingColumnsIpType'),
      cell: () => {
        return <IpType ip={row.original}></IpType>;
      },
    },
    {
      id: 'ip-alerts',
      label: t('listingColumnsIpAlerts'),
      cell: () => {
        return <IpAlerts ip={row.original}></IpAlerts>;
      },
    },
    {
      id: 'ip-region',
      label: t('listingColumnsIpRegion'),
      cell: () => {
        return <IpRegion ip={row.original}></IpRegion>;
      },
    },
    {
      id: 'ip-country',
      label: t('listingColumnsIpCountry'),
      cell: () => {
        return <IpCountry ip={row.original}></IpCountry>;
      },
    },
    {
      id: 'ip-attached-service',
      label: t('listingColumnsIpAttachedService'),
      cell: () => {
        return <IpAttachedService ip={row.original}></IpAttachedService>;
      },
    },
    {
      id: 'ip-reverse',
      label: t('listingColumnsIpReverseDNS'),
      cell: (ip: string) => {
        return <IpReverse ip={ip}></IpReverse>;
      },
    },
    {
      id: 'ip-vmac',
      label: t('listingColumnsIpVMac'),
      cell: (ip: string) => {
        return <IpVmac ip={ip}></IpVmac>;
      },
    },
    {
      id: 'ip-ddos',
      label: t('listingColumnsIpAntiDDos'),
      cell: (ip: string) => {
        return <IpAntiDdos ip={ip}></IpAntiDdos>;
      },
    },
    {
      id: 'ip-edge-firewall',
      label: t('listingColumnsIpEdgeFirewall'),
      cell: (ip: string) => {
        return <IpEdgeFirewall ip={ip}></IpEdgeFirewall>;
      },
    },
    {
      id: 'ip-game-firewall',
      label: t('listingColumnsIpGameFirewall'),
      cell: (ip: string) => {
        return <IpGameFirewall ip={ip}></IpGameFirewall>;
      },
    },
    {
      id: 'action',
      label: '',
      cell: (ip: string) => <ActionsCell ip={ip} />,
    },
  ];

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
    />
  );
};
