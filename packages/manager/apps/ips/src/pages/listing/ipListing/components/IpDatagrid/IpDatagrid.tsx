import { useContext, useEffect, useState } from 'react';
import { ExpandedState, VisibilityState } from '@tanstack/react-table';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { Datagrid, Error, RedirectionGuard } from '@ovh-ux/muk';

import { useGetIpList } from '@/data/hooks/ip';
import { urls } from '@/routes/routes.constant';
import { ipFormatter } from '@/utils';

import { ListingContext } from '../../../listingContext';
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
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ip: true,
    'ip-type': true,
    'ip-alerts': true,
    'ip-region': false,
    'ip-country': false,
    'ip-attached-service': false,
    'ip-reverse': false,
    'ip-vmac': false,
    'ip-ddos': false,
    'ip-edge-firewall': true,
    'ip-game-firewall': true,
    actions: true,
  });

  const handleFetchAllPages = async () => {
    setNumberOfPageDisplayed(filteredIpList.length / pageSize);
  };

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
      ? uniqueIpList.filter((ip) => ip.includes(apiFilter.ip))
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
      errorComponent={<Error error={error} />}
    >
      <Datagrid
        containerHeight={numberOfPageDisplayed * pageSize * 51 + 50}
        subComponentHeight={350}
        size={TABLE_SIZE.sm}
        columns={columns}
        data={paginatedIpList}
        totalCount={filteredIpList?.length}
        hasNextPage={numberOfPageDisplayed * pageSize < filteredIpList?.length}
        onFetchNextPage={() => setNumberOfPageDisplayed((nb) => nb + 1)}
        onFetchAllPages={handleFetchAllPages}
        isLoading={isLoading}
        columnVisibility={{ columnVisibility, setColumnVisibility }}
        resourceType="ip"
        expandable={{
          expanded,
          setExpanded,
          getRowCanExpand: (row) =>
            ipFormatter(row.original.ip).isGroup &&
            !onGoingCreatedIps.includes(row.original.ip) &&
            !onGoingAggregatedIps.includes(row.original.ip) &&
            !onGoingSlicedIps.includes(row.original.ip),
        }}
        renderSubComponent={(row, headerRefs) => (
          <IpGroupDatagrid
            row={row}
            parentHeaders={headerRefs}
            columnVisibility={columnVisibility}
          />
        )}
      />
    </RedirectionGuard>
  );
};
