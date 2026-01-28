import {
  Datagrid,
  ErrorBanner,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ODS_TABLE_SIZE } from '@ovhcloud/ods-components';
import { useGetIpList } from '@/data/hooks/ip';
import { ListingContext } from '../../../listingContext';
import { urls } from '@/routes/routes.constant';
import { ipFormatter, isIpMatchingSearch } from '@/utils';
import { IpGroupDatagrid } from '../ipGroupDatagrid/ipGroupDatagrid';
import { useIpDatagridColumns } from './useIpDatagridColumns';

const pageSize = 10;

export const IpDatagrid = () => {
  const {
    apiFilter,
    hasNoApiFilter,
    onGoingAggregatedIps,
    onGoingSlicedIps,
    onGoingCreatedIps,
  } = useContext(ListingContext);
  const [paginatedIpList, setPaginatedIpList] = useState<{ ip: string }[]>([]);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const { ipList, isLoading, error, isError } = useGetIpList(apiFilter);
  const [filteredIpList, setFilteredIpList] = useState<string[]>([]);
  const columns = useIpDatagridColumns();

  useEffect(() => {
    if (!ipList) return;

    const ipListWithOngoingOperations = [
      ...ipList,
      ...onGoingAggregatedIps,
      ...onGoingSlicedIps,
      ...onGoingCreatedIps,
    ];

    // remove duplicates
    const ipSet = new Set(ipListWithOngoingOperations);
    const uniqueIpList = Array.from(ipSet);

    // filter by apiFilter.ip if exists
    const filtered = apiFilter?.ip
      ? uniqueIpList.filter((ip) => isIpMatchingSearch(ip, apiFilter.ip))
      : uniqueIpList;
    setFilteredIpList(filtered);
    setPaginatedIpList(
      filtered.map((ip) => ({ ip })).slice(0, pageSize * numberOfPageDisplayed),
    );
  }, [
    ipList,
    onGoingAggregatedIps,
    onGoingSlicedIps,
    onGoingCreatedIps,
    numberOfPageDisplayed,
    apiFilter?.ip,
  ]);

  return (
    <RedirectionGuard
      isLoading={isLoading}
      condition={!isLoading && !ipList?.length && hasNoApiFilter}
      route={urls.onboarding}
      isError={isError}
      errorComponent={<ErrorBanner error={error as ApiError} />}
    >
      <Datagrid
        size={ODS_TABLE_SIZE.sm}
        columns={columns}
        items={paginatedIpList}
        totalItems={filteredIpList?.length}
        hasNextPage={numberOfPageDisplayed * pageSize < filteredIpList?.length}
        onFetchNextPage={() => setNumberOfPageDisplayed((nb) => nb + 1)}
        getRowCanExpand={(row) =>
          ipFormatter(row.original.ip).isGroup &&
          !onGoingCreatedIps.includes(row.original.ip) &&
          !onGoingAggregatedIps.includes(row.original.ip) &&
          !onGoingSlicedIps.includes(row.original.ip)
        }
        renderSubComponent={(row, headerRefs) => (
          <IpGroupDatagrid row={row} parentHeaders={headerRefs} />
        )}
        isLoading={isLoading}
        numberOfLoadingRows={pageSize}
        resetExpandedRowsOnItemsChange
      />
    </RedirectionGuard>
  );
};
