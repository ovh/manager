import React, { useEffect } from 'react';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { Datagrid } from '@ovh-ux/muk';

import { useShares } from '@/data/hooks/shares/useShares';
import { useShareColumn } from '@/pages/list/hooks/useShareColumn';
import { useShareDatagridFiltering } from '@/pages/list/hooks/useShareDatagridFiltering';
import { useShareDatagridSorting } from '@/pages/list/hooks/useShareDatagridSorting';
import { TShareListRow, selectSharesForList } from '@/pages/list/view-model/shareList.view-model';

import { ShareDatagridTopbar } from './ShareDatagridTopbar.component';

{
  /* eslint-disable @typescript-eslint/no-unused-expressions */
}

export const SHARES_PAGE_SIZE = 20;

/*
 This is needed to remove the invisible arrow used to display the sorting of a column
 Sadly the 'isSortable = false" on the column definition doesn't work so we have to hack this to avoid a broken display
 */
const removeSorting = () => {
  document.querySelector('div[data-testid="header-protocol"]')?.children?.item(1)?.remove();
  document.querySelector('div[data-testid="header-status"]')?.children?.item(1)?.remove();
  document.querySelector('div[data-testid="header-actions"]')?.children?.item(1)?.remove();

  document.querySelector('div[data-testid="header-protocol"]')?.classList?.remove('cursor-pointer');
  document.querySelector('div[data-testid="header-status"]')?.classList?.remove('cursor-pointer');
  document.querySelector('div[data-testid="header-actions"]')?.classList?.remove('cursor-pointer');
};

/*
 This INCREDIBLE method is used to make the reload button be next to the search field.
 */
const moveReloadButton = () => {
  const right = document.querySelector('#right-side');
  const reloadButton = document.querySelector('#reload-button');

  reloadButton?.classList?.add('mr-6');
  reloadButton && right?.firstElementChild?.prepend(reloadButton);
};

// This is needed to handle the datagrid container imposed by MUK. If we don't do this we get a vertical scroll that's not wanted. No better solution was found (yet) //
const getContainerHeight = (dataSize: number) => (dataSize + 1) * 50 + 10;

export const ShareDatagrid: React.FC = () => {
  const { queryFilters, searchProps } = useShareDatagridFiltering();
  const { sort, sortOrder, sortingProps } = useShareDatagridSorting();

  const {
    data: shares = [] as TShareListRow[],
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetching,
  } = useShares({
    queryParams: { limit: SHARES_PAGE_SIZE, filters: queryFilters, sort, sortOrder },
    select: selectSharesForList,
  });

  const columns = useShareColumn();

  useEffect(() => {
    removeSorting();
    moveReloadButton();
  }, []);

  return (
    <div
      className={`flex flex-col gap-4 [&_#left-side]:!w-auto [&_#left-side]:!flex-[unset] [&_#right-side]:w-auto [&_th]:!break-normal`}
    >
      <Datagrid
        columns={columns}
        data={shares as TShareListRow[]}
        isLoading={isLoading}
        topbar={<ShareDatagridTopbar refetch={() => void refetch()} isFetching={isFetching} />}
        containerHeight={getContainerHeight(shares.length)}
        maxRowHeight={50}
        size={TABLE_SIZE.sm}
        search={searchProps}
        sorting={sortingProps}
        hasNextPage={hasNextPage}
        onFetchNextPage={() => void fetchNextPage()}
      />
    </div>
  );
};
