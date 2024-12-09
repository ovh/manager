import { Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { TResourceUsage } from '@/api/hook/useConsumption';
import { useColdArchiveListColumns } from './useColdArchiveListColumns';

type ColdArchiveListProps = {
  coldArchives: TResourceUsage[];
};

export default function ColdArchiveList({
  coldArchives,
}: Readonly<ColdArchiveListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/cold-archive');
  const columns = useColdArchiveListColumns();

  const { pagination, setPagination } = useDataGrid();

  const paginatedColdArchives = useMemo(() => {
    const sortedColdArchives = coldArchives?.sort((a, b) =>
      a.region.localeCompare(b.region),
    );

    return paginateResults(sortedColdArchives || [], pagination);
  }, [coldArchives, pagination, setPagination]);

  if (paginatedColdArchives.totalRows === 0) {
    return <NoDataMessage message={t('pci_billing_cold_archive_no_entry')} />;
  }

  return (
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={paginatedColdArchives.rows}
        totalItems={paginatedColdArchives.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
