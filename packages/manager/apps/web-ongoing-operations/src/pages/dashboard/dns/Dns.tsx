import React from 'react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { TOngoingOperationsData } from 'src/types';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/Loading/Loading';
import { useOngoingOperationDatagridColumns } from '@/hooks/useOngoingOperationDatagridColumns';
import { getmeTaskDnsList } from '@/data/api/web-ongoing-operations';

export default function Domain() {
  const { data: dnsList, isLoading } = useQuery<TOngoingOperationsData>({
    queryKey: ['dnsList'],
    queryFn: () => getmeTaskDnsList(),
  });

  const columns = useOngoingOperationDatagridColumns(false, dnsList);

  if (isLoading) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  return (
    <React.Suspense>
      {dnsList && (
        <div data-testid="dns">
          <Datagrid
            columns={columns}
            items={dnsList.data}
            totalItems={dnsList?.data.length}
          />
        </div>
      )}
    </React.Suspense>
  );
}
