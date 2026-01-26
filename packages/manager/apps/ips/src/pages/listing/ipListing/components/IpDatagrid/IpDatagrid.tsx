import { useContext, useState } from 'react';
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
    'ip-type': false,
    'ip-region': true,
    'ip-country': false,
    'ip-attached-service': true,
    'ip-reverse': true,
    'ip-vmac': false,
    'ip-ddos': false,
    'ip-edge-firewall': true,
    'ip-game-firewall': false,
    'ip-alerts': true,
    actions: true,
  });

  return (
    <RedirectionGuard
      isLoading={isLoading}
      condition={!isLoading && !datagridIpList?.length && hasNoApiFilter}
      route={urls.onboarding}
      isError={isError}
      errorComponent={<Error error={error} />}
    >
      <Datagrid
        containerHeight={numberOfPageDisplayed * pageSize * 51 + 50}
        size={TABLE_SIZE.sm}
        columns={columns}
        data={datagridIpList || []}
        totalCount={totalCount}
        hasNextPage={numberOfPageDisplayed * pageSize < totalCount}
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
    </RedirectionGuard>
  );
};
