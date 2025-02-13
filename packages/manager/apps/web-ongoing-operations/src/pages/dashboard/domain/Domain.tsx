import React from 'react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { TOngoingOperations } from 'src/types';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/Loading/Loading';
import {
  ParentEnum,
  useOngoingOperationDatagridColumns,
} from '@/hooks/useOngoingOperationDatagridColumns';
import { getmeTaskDomainList } from '@/data/api/web-ongoing-operations';

export default function Domain() {
  const fetchDomainList = async () => {
    const response = await getmeTaskDomainList();
    return response.data as TOngoingOperations[];
  };

  const { data: domainList, isLoading } = useQuery({
    queryKey: ['domainList'],
    queryFn: () => fetchDomainList(),
  });

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
