import { useMemo } from 'react';
import { useParam } from '@ovh-ux/manager-pci-common';
import { Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { TResourceUsage } from '@/api/hook/useConsumption';
import { useShares } from '@/api/hook/useShares';
import {
  TShareUsage,
  useFileStorageListColumns,
} from './useFileStorageListColumns';

type FileStorageListProps = {
  shares: TResourceUsage[];
};

export default function FileStorageList({
  shares,
}: Readonly<FileStorageListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/file-storage');
  const { projectId } = useParam('projectId');
  const { pagination, setPagination } = useDataGrid();
  const columns = useFileStorageListColumns();

  // Billing rows only carry a generic name ("share") and no type; enrich both
  // from the shares list by matching the billing resourceId with the share id.
  const { data: allShares, isPending } = useShares(projectId);

  const enrichedShares = useMemo<TShareUsage[]>(() => {
    const shareById = new Map(
      (allShares ?? []).map((share) => [share.id, share]),
    );
    return [...shares]
      .map((row) => {
        const share = row.resourceId
          ? shareById.get(row.resourceId)
          : undefined;
        return {
          ...row,
          name: share?.name ?? row.resourceId ?? row.name,
          type: share?.type,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [shares, allShares]);

  const paginatedShares = useMemo(
    () => paginateResults(enrichedShares, pagination),
    [enrichedShares, pagination, setPagination],
  );

  if (isPending) {
    return (
      <div className="flex justify-center">
        <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />
      </div>
    );
  }

  if (paginatedShares.totalRows === 0) {
    return <NoDataMessage message={t('cpbc_no_consumption_data')} />;
  }

  return (
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={paginatedShares.rows}
        totalItems={paginatedShares.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
