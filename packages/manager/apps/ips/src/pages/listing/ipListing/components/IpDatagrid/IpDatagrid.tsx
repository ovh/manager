import {
  Datagrid,
  ErrorBanner,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGetIpList } from '@/data/hooks/ip';
import { ListingContext } from '../../../listingContext';
import { urls } from '@/routes/routes.constant';
import { ipFormatter } from '@/utils';
import { IpGroupDatagrid } from '../ipGroupDatagrid/ipGroupDatagrid';
import { useIpDatagridColumns } from './useIpDatagridColumns';

const pageSize = 10;

export const IpDatagrid = () => {
  const { apiFilter, hasNoApiFilter } = useContext(ListingContext);
  const [paginatedIpList, setPaginatedIpList] = useState<{ ip: string }[]>([]);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const { ipList, isLoading, error, isError } = useGetIpList(apiFilter);
  const [filteredIpList, setFilteredIpList] = useState<string[]>([]);
  const columns = useIpDatagridColumns();

  useEffect(() => {
    if (!ipList) return;
    const filtered = apiFilter?.ip
      ? ipList.filter((ip) => ip.includes(apiFilter.ip))
      : ipList;
    setFilteredIpList(filtered);
    setPaginatedIpList(
      filtered.map((ip) => ({ ip })).slice(0, pageSize * numberOfPageDisplayed),
    );
  }, [ipList, numberOfPageDisplayed, apiFilter?.ip]);

  return (
    <RedirectionGuard
      isLoading={isLoading}
      condition={!isLoading && !ipList?.length && hasNoApiFilter}
      route={urls.onboarding}
      isError={isError}
      errorComponent={<ErrorBanner error={error as ApiError} />}
    >
      <Datagrid
        columns={columns}
        items={paginatedIpList}
        totalItems={filteredIpList?.length}
        hasNextPage={numberOfPageDisplayed * pageSize < filteredIpList?.length}
        onFetchNextPage={() => setNumberOfPageDisplayed((nb) => nb + 1)}
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
