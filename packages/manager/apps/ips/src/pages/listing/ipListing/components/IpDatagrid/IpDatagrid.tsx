import {
  Datagrid,
  ErrorBanner,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
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
import { useGetIpList } from '@/data/hooks/ip';
import { ListingContext } from '../../../listingContext';
import { urls } from '@/routes/routes.constant';
import { ipFormatter } from '@/utils';
import { IpGroupDatagrid } from '../ipGroupDatagrid/ipGroupDatagrid';

export const IpDatagrid = () => {
  const { apiFilter, ipToSearch } = useContext(ListingContext);
  const [paginatedIpList, setPaginatedIpList] = useState<{ ip: string }[]>([]);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const [filteredIpList, setFilteredIpList] = useState<string[]>([]);

  const pageSize = 10;
  const { t } = useTranslation('listing');

  const { ipList, isLoading, error, isError } = useGetIpList(apiFilter);
  const columns = [
    {
      id: 'ip',
      label: t('listingColumnsIp'),
      cell: IpCell,
    },
    {
      id: 'ip-type',
      label: t('listingColumnsIpType'),
      cell: IpType,
    },
    {
      id: 'ip-alerts',
      label: t('listingColumnsIpAlerts'),
      cell: IpAlerts,
    },
    {
      id: 'ip-region',
      label: t('listingColumnsIpRegion'),
      cell: IpRegion,
    },
    {
      id: 'ip-country',
      label: t('listingColumnsIpCountry'),
      cell: IpCountry,
    },
    {
      id: 'ip-attached-service',
      label: t('listingColumnsIpAttachedService'),
      cell: IpAttachedService,
    },
    {
      id: 'ip-reverse',
      label: t('listingColumnsIpReverseDNS'),
      cell: IpReverse,
    },
    {
      id: 'ip-vmac',
      label: t('listingColumnsIpVMac'),
      cell: IpVmac,
    },
    {
      id: 'ip-ddos',
      label: t('listingColumnsIpAntiDDos'),
      cell: IpAntiDdos,
    },
    {
      id: 'ip-edge-firewall',
      label: t('listingColumnsIpEdgeFirewall'),
      cell: IpEdgeFirewall,
    },
    {
      id: 'ip-game-firewall',
      label: t('listingColumnsIpGameFirewall'),
      cell: IpGameFirewall,
    },
    {
      id: 'action',
      label: '',
      cell: IpActionsCell,
    },
  ];

  useEffect(() => {
    if (!ipList) return;
    const filtered = ipToSearch
      ? ipList.filter((ip) => ip.indexOf(ipToSearch) !== -1)
      : ipList;
    setFilteredIpList(filtered);
    setPaginatedIpList(
      filtered.map((ip) => ({ ip })).slice(0, pageSize * numberOfPageDisplayed),
    );
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
        getRowCanExpand={(row) => ipFormatter(row.original.ip).isGroup}
        renderSubComponent={(row, headerRefs) => (
          <IpGroupDatagrid row={row} parentHeaders={headerRefs} />
        )}
        isLoading={isLoading}
        numberOfLoadingRows={10}
        resetExpandedRowsOnItemsChange
      />
    </RedirectionGuard>
  );
};
