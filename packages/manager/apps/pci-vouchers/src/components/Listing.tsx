import { OsdsDatagrid } from '@ovhcloud/ods-components/datagrid/react';
import { OdsDatagridColumn } from '@ovhcloud/ods-components/datagrid/dist/types/components';

import '@ovhcloud/ods-theme-blue-jeans';
import { useMemo, useState } from 'react';
import { OsdsPagination } from '@ovhcloud/ods-components/pagination/react';
import { OsdsSelect } from '@ovhcloud/ods-components/select/react';
import { OdsPaginationCurrentChangeEvent } from '@ovhcloud/ods-components/pagination';
import { OdsSelectValueChangeEvent } from '@ovhcloud/ods-components/select';

interface ListingProps<T> {
  headers: OdsDatagridColumn[];
  items: T[];
}

export default function Listing<T>({ headers, items }: ListingProps<T>) {
  const [index, setIndex] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const itemsFiltered = useMemo(() => {
    return items.slice(index - 1, resultPerPage);
  }, [items, resultPerPage, index]);
  console.log(OsdsSelect);
  return (
    <>
      <OsdsDatagrid
        columns={headers}
        rows={itemsFiltered}
        height={600}
        hasHideableColumns={false}
      ></OsdsDatagrid>
      <OsdsPagination
        className={'mt-4'}
        totalItems={items.length}
        onOdsPaginationChanged={(event: OdsPaginationCurrentChangeEvent) => {
          setIndex(event.detail.current);
        }}
        onOdsValueChange={(event: OdsSelectValueChangeEvent) => {
          setResultPerPage(event.detail.value as number);
        }}
      ></OsdsPagination>
    </>
  );
}
