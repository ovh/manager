import {
  Datagrid,
  ErrorBanner,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
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
import { useGetIpList } from '@/data/hooks/ip';
import { ListingContext } from '../../listingContext';
import { urls } from '@/routes/routes.constant';
import { ipFormatter } from '@/utils';
import { IpGroupDatagrid } from '../ipGroupDatagrid/ipGroupDatagrid';

export const IpDatagrid = () => {
  const { apiFilter, ipToSearch } = useContext(ListingContext);
  const [paginatedIpList, setPaginatedIpList] = useState<string[]>([]);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const [filteredIpList, setFilteredIpList] = useState<string[]>([]);

  const pageSize = 10;
  const { t } = useTranslation('listing');

  const { ipList, isLoading, error, isError } = useGetIpList(apiFilter);
  const columns = [
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
      cell: (ip: string) => {
        return <IpType ip={ip}></IpType>;
      },
    },
    {
      id: 'ip-alerts',
      label: t('listingColumnsIpAlerts'),
      cell: (ip: string) => {
        return <IpAlerts ip={ip}></IpAlerts>;
      },
    },
    {
      id: 'ip-region',
      label: t('listingColumnsIpRegion'),
      cell: (ip: string) => {
        return <IpRegion ip={ip}></IpRegion>;
      },
    },
    {
      id: 'ip-country',
      label: t('listingColumnsIpCountry'),
      cell: (ip: string) => {
        return <IpCountry ip={ip}></IpCountry>;
      },
    },
    {
      id: 'ip-attached-service',
      label: t('listingColumnsIpAttachedService'),
      cell: (ip: string) => {
        return <IpAttachedService ip={ip}></IpAttachedService>;
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
    if (!ipList) return;
    const filtered = ipToSearch
      ? ipList.filter((ip) => ip.indexOf(ipToSearch) !== -1)
      : ipList;
    setFilteredIpList(filtered);
    setPaginatedIpList(filtered.slice(0, pageSize * numberOfPageDisplayed));
  }, [ipList, numberOfPageDisplayed, ipToSearch]);

  const loadMoreIps = () => {
    setNumberOfPageDisplayed(numberOfPageDisplayed + 1);
  };

  return (
    <RedirectionGuard
      isLoading={false}
      condition={!isLoading && !ipList?.length}
      route={urls.onboarding}
      isError={isError}
      errorComponent={<ErrorBanner error={error as ApiError} />}
    >
      <Datagrid
        columns={columns}
        items={paginatedIpList}
        totalItems={filteredIpList?.length}
        hasNextPage={numberOfPageDisplayed * pageSize < filteredIpList?.length}
        onFetchNextPage={loadMoreIps}
        getRowCanExpand={(row) => ipFormatter(row.original).isGroup}
        renderSubComponent={(row, headerRefs) => {
          return (
            <IpGroupDatagrid
              row={row}
              parentHeaders={headerRefs}
            ></IpGroupDatagrid>
          );
        }}
        isLoading={isLoading}
        numberOfLoadingRows={10}
        resetExpandedRowsOnItemsChange={true}
      />
    </RedirectionGuard>
  );
};
