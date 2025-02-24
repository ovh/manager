import React from 'react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { TOngoingOperations, TOngoingOperationsData } from 'src/types';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/Loading/Loading';
import {
  ParentEnum,
  useOngoingOperationDatagridColumns,
} from '@/hooks/useOngoingOperationDatagridColumns';
import { getmeTaskDomainList } from '@/data/api/web-ongoing-operations';

export default function Domain() {
  const { data: domainList, isLoading } = useQuery<TOngoingOperationsData>({
    queryKey: ['domainList'],
    queryFn: () => getmeTaskDomainList(),
  });

  const columns = useOngoingOperationDatagridColumns(
    ParentEnum.Domain,
    domainList as TOngoingOperations[],
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
            items={domainList.data}
            totalItems={domainList?.data.length}
          />
        </div>
      )}
    </React.Suspense>
  );
}
