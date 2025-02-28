import React from 'react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import Loading from '@/components/Loading/Loading';
import {
  ParentEnum,
  useOngoingOperationDatagridColumns,
} from '@/hooks/useOngoingOperationDatagridColumns';
import { useDomainList } from '@/hooks/data/data';

export default function Domain() {
  const { data: domainList, isLoading } = useDomainList();

  const columns = useOngoingOperationDatagridColumns(
    ParentEnum.Domain,
    domainList,
  );

  if (isLoading) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  return (
    <React.Suspense>
      {domainList && (
        <div data-testid="datagrid">
          <Datagrid
            columns={columns}
            items={domainList}
            totalItems={domainList.length}
          />
        </div>
      )}
    </React.Suspense>
  );
}
