import { useContext, useMemo, useState } from 'react';
import { ExpandedState, VisibilityState } from '@tanstack/react-table';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { Datagrid, Error, RedirectionGuard } from '@ovh-ux/muk';

import { urls } from '@/routes/routes.constant';

import { ListingContext } from '../../../listingContext';
import { useIpDatagridColumns } from './useIpDatagridColumns';
import { useFilteredIpList } from './useFilteredIpList';

const pageSize = 10;

export const IpDatagrid = () => {
  const { hasNoApiFilter } = useContext(ListingContext);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const {
    datagridIpList,
    totalCount,
    isLoading,
    isError,
    error,
  } = useFilteredIpList(numberOfPageDisplayed, pageSize);
  const columns = useIpDatagridColumns();
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ip: true,
    'ip-type': true,
    'ip-region': true,
    'ip-country': true,
    'ip-attached-service': true,
    'ip-reverse': true,
    'ip-vmac': true,
    'ip-ddos': true,
    'ip-edge-firewall': true,
    'ip-game-firewall': true,
    actions: true,
  });

  const containerHeight = useMemo(() => {
    const rowHeight = 55;
    const headerHeight = 55;
    return numberOfPageDisplayed * pageSize * rowHeight + headerHeight;
  }, [numberOfPageDisplayed, pageSize]);

  const hasNextPage = useMemo(
    () => numberOfPageDisplayed * pageSize < totalCount,
    [numberOfPageDisplayed, pageSize, totalCount],
  );

  const datagrid = useMemo(
    () => (
      <Datagrid
        containerHeight={containerHeight}
        size={TABLE_SIZE.sm}
        columns={columns}
        data={datagridIpList || []}
        totalCount={totalCount}
        hasNextPage={hasNextPage}
        onFetchNextPage={() => setNumberOfPageDisplayed((nb) => nb + 1)}
        isLoading={isLoading}
        columnVisibility={{ columnVisibility, setColumnVisibility }}
        resourceType="ip"
        expandable={{
          expanded,
          setExpanded,
          getRowCanExpand: (row) => row.subRows && row.subRows.length > 0,
        }}
      />
    ),
    [
      containerHeight,
      hasNextPage,
      columns,
      datagridIpList,
      totalCount,
      isLoading,
      expanded,
      columnVisibility,
    ],
  );

  return (
    <RedirectionGuard
      isLoading={isLoading}
      condition={!isLoading && !datagridIpList?.length && hasNoApiFilter}
      route={urls.onboarding}
      isError={isError}
      errorComponent={<Error error={error} />}
    >
      {datagrid}
    </RedirectionGuard>
  );
};
