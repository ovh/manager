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
import { IpFilter, TypeFilter } from '../filters';
import { ipFormatter } from '@/utils';
import { getIpReverse } from '@/data/api';

// export type CellType = string;
export type CellType = {
  ip: string;
  subRows?: CellType[];
};

export const IpDatagrid = () => {
  const { apiFilter, ipToSearch } = useContext(ListingContext);
  const [paginatedIpList, setPaginatedIpList] = useState<CellType[]>([]);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const [filteredIpList, setFilteredIpList] = useState<CellType[]>([]);

  const pageSize = 10;
  const { t } = useTranslation('listing');

  const { ipList, isLoading, error, isError } = useGetIpList(apiFilter);
  const columns = [
    {
      id: 'ip',
      label: t('listingColumnsIp'),
      cell: (cell: CellType) => {
        return <IpCell ip={cell.ip}></IpCell>;
      },
    },
    {
      id: 'ip-type',
      label: t('listingColumnsIpType'),
      cell: (cell: CellType) => {
        return <IpType ip={cell.ip}></IpType>;
      },
    },
    {
      id: 'ip-alerts',
      label: t('listingColumnsIpAlerts'),
      cell: (cell: CellType) => {
        return <IpAlerts ip={cell.ip}></IpAlerts>;
      },
    },
    {
      id: 'ip-region',
      label: t('listingColumnsIpRegion'),
      cell: (cell: CellType) => {
        return <IpRegion ip={cell.ip}></IpRegion>;
      },
    },
    {
      id: 'ip-country',
      label: t('listingColumnsIpCountry'),
      cell: (cell: CellType) => {
        return <IpCountry ip={cell.ip}></IpCountry>;
      },
    },
    {
      id: 'ip-attached-service',
      label: t('listingColumnsIpAttachedService'),
      cell: (cell: CellType) => {
        return <IpAttachedService ip={cell.ip}></IpAttachedService>;
      },
    },
    {
      id: 'ip-reverse',
      label: t('listingColumnsIpReverseDNS'),
      cell: (cell: CellType) => {
        return <IpReverse ip={cell.ip}></IpReverse>;
      },
    },
    {
      id: 'ip-vmac',
      label: t('listingColumnsIpVMac'),
      cell: (cell: CellType) => {
        return <IpVmac ip={cell.ip}></IpVmac>;
      },
    },
    {
      id: 'ip-ddos',
      label: t('listingColumnsIpAntiDDos'),
      cell: (cell: CellType) => {
        return <IpAntiDdos ip={cell.ip}></IpAntiDdos>;
      },
    },
    {
      id: 'ip-edge-firewall',
      label: t('listingColumnsIpEdgeFirewall'),
      cell: (cell: CellType) => {
        return <IpEdgeFirewall ip={cell.ip}></IpEdgeFirewall>;
      },
    },
    {
      id: 'ip-game-firewall',
      label: t('listingColumnsIpGameFirewall'),
      cell: (cell: CellType) => {
        return <IpGameFirewall ip={cell.ip}></IpGameFirewall>;
      },
    },
    {
      id: 'action',
      label: '',
      cell: (cell: CellType) => <ActionsCell ip={cell.ip} />,
    },
  ];

  useEffect(() => {
    if (!ipList) return;

    const filtered = ipToSearch
      ? ipList.filter((ip) => ip.indexOf(ipToSearch) !== -1)
      : ipList;
    setFilteredIpList(filtered.map((ip) => ({ ip })));
    setPaginatedIpList(
      filtered.map((ip) => ({ ip })).slice(0, pageSize * numberOfPageDisplayed),
    );
  }, [ipList, numberOfPageDisplayed, ipToSearch]);

  const loadMoreIps = () => {
    setNumberOfPageDisplayed(numberOfPageDisplayed + 1);
  };

  const getIpChild = async (ip: string) => {
    const { data: ipChildList } = await getIpReverse({ ip });
    const paginatedListWithSubRows = paginatedIpList.map((row: CellType) => {
      if (ip === row.ip)
        return {
          ...row,
          subRows: ipChildList.map((ipChild) => ({ ip: ipChild.ipReverse })),
        };
      return row;
    });
    // eslint-disable-next-line no-console
    console.log(paginatedListWithSubRows);
    setPaginatedIpList(paginatedListWithSubRows);
    return paginatedListWithSubRows;
  };

  return (
    <RedirectionGuard
      isLoading={false}
      condition={!isLoading && !ipList?.length}
      route={urls.onboarding}
      isError={isError}
      errorComponent={<ErrorBanner error={error as ApiError} />}
    >
      <IpFilter />
      <TypeFilter />
      <Datagrid
        columns={columns}
        items={paginatedIpList}
        totalItems={filteredIpList?.length}
        hasNextPage={numberOfPageDisplayed * pageSize < filteredIpList?.length}
        onFetchNextPage={loadMoreIps}
        getRowCanExpand={(row) => ipFormatter(row.original.ip).isGroup}
        onExpand={(row) => getIpChild(row.original.ip)}
        getSubRows={(originalRow) => {
          // eslint-disable-next-line no-console
          console.log(originalRow.subRows);
          return originalRow.subRows;
        }}
        isLoading={isLoading}
        numberOfLoadingRows={10}
        // renderSubComponent={(row) => {
        //   return <IpGroupDatagrid row={row}></IpGroupDatagrid>;
        // }}
      />
    </RedirectionGuard>
  );
};
