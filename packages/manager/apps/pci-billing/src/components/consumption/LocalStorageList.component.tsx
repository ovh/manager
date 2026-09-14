import { useMemo } from 'react';
import { useInstances, useParam } from '@ovh-ux/manager-pci-common';
import { Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { paginateResults } from '@/api/data/consumption';
import { TLocalStorage } from '@/api/hook/useConsumption';
import NoDataMessage from './NoDataMessage.component';
import {
  TLocalStorageUsage,
  useLocalStorageListColumns,
} from './useLocalStorageListColumns';

type LocalStorageListProps = {
  localStorages: TLocalStorage[];
};

export default function LocalStorageList({
  localStorages,
}: Readonly<LocalStorageListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/local-storage');
  const { projectId } = useParam('projectId');
  const { pagination, setPagination } = useDataGrid();
  const columns = useLocalStorageListColumns();

  const { data: allInstances, isPending } = useInstances(projectId);

  const enrichedLocalStorages = useMemo<TLocalStorageUsage[]>(() => {
    const instanceById = new Map(
      (allInstances ?? []).map((instance) => [instance.id, instance]),
    );

    return [...localStorages]
      .map((row) => {
        const instanceId = row.resourceId ?? row.instanceId;
        return {
          ...row,
          instanceName: instanceById.get(instanceId)?.name ?? instanceId,
        };
      })
      .sort((a, b) => a.instanceName.localeCompare(b.instanceName));
  }, [localStorages, allInstances]);

  const paginatedLocalStorages = useMemo(
    () => paginateResults(enrichedLocalStorages, pagination),
    [enrichedLocalStorages, pagination, setPagination],
  );

  if (isPending) {
    return (
      <div className="flex justify-center">
        <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />
      </div>
    );
  }

  if (paginatedLocalStorages.totalRows === 0) {
    return <NoDataMessage message={t('cpbc_no_consumption_data')} />;
  }

  return (
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={paginatedLocalStorages.rows}
        totalItems={paginatedLocalStorages.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
