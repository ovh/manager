import { OsdsDatagrid, OsdsPagination } from '@ovhcloud/ods-components/react';
import {
  OdsDatagridColumn,
  OdsDatagridRow,
  OdsPaginationCurrentChangeEvent,
  OdsPaginationItemPerPageChangedEvent,
} from '@ovhcloud/ods-components';

import '@ovhcloud/ods-theme-blue-jeans';
import { useMemo, useState } from 'react';

interface ListingProps<T> {
  headers: OdsDatagridColumn[];
  items: T[];
}

export default function Listing<T>({ headers, items }: ListingProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [numResultPerPage, setNumResultPerPage] = useState(10);
  const itemsFiltered = useMemo(() => {
    const startIndex = (currentPage - 1) * numResultPerPage;
    return items.slice(startIndex, startIndex + numResultPerPage);
  }, [items, numResultPerPage, currentPage]);

  const onPaginationChange = (event: OdsPaginationCurrentChangeEvent) => {
    setCurrentPage(event.detail.current);
  };

  const onPaginationItemPerPageChange = (
    event: OdsPaginationItemPerPageChangedEvent,
  ) => {
    setCurrentPage(event.detail.currentPage);
    setNumResultPerPage(event.detail.current);
  };

  return (
    <>
      <OsdsDatagrid
        columns={headers}
        rows={itemsFiltered as OdsDatagridRow[]}
        height={600}
        hasHideableColumns={false}
      ></OsdsDatagrid>
      <OsdsPagination
        className={'mt-4'}
        totalItems={items.length}
        totalPages={3}
        onOdsPaginationChanged={onPaginationChange}
        onOdsPaginationItemPerPageChanged={onPaginationItemPerPageChange}
      ></OsdsPagination>
    </>
  );
}
