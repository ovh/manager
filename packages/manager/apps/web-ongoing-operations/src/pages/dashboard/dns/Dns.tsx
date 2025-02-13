import React from 'react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { TOngoingOperations } from 'src/types';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/Loading/Loading';
import {
  ParentEnum,
  useOngoingOperationDatagridColumns,
} from '@/hooks/useOngoingOperationDatagridColumns';
import { getmeTaskDnsList } from '@/data/api/web-ongoing-operations';

export default function Domain() {
  const fetchDnsList = async () => {
    const response = await getmeTaskDnsList();
    return response.data as TOngoingOperations[];
  };

  const { data: dnsList, isLoading } = useQuery<TOngoingOperations[]>({
    queryKey: ['dnsList'],
    queryFn: () => fetchDnsList(),
  });

  const columns = useOngoingOperationDatagridColumns(
    ParentEnum.Zone,
    dnsList as TOngoingOperations[],
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
      {dnsList && (
        <div data-testid="dns">
          <Datagrid
            columns={columns}
            items={dnsList}
            totalItems={dnsList.length}
          />
        </div>
      )}
    </React.Suspense>
  );
}
