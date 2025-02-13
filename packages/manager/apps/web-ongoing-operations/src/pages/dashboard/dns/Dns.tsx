import React from 'react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { TOngoingOperations } from 'src/types';
import Loading from '@/components/Loading/Loading';
import {
  ParentEnum,
  useOngoingOperationDatagridColumns,
} from '@/hooks/useOngoingOperationDatagridColumns';
import { useDnsList } from '@/hooks/data/data';

export default function Domain() {
  const { data: dnsList, isLoading } = useDnsList();

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
