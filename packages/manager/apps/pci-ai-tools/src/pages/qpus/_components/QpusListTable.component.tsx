import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton } from '@datatr-ux/uxlib';
import { getColumns } from '@/pages/notebooks/_components/NotebooksListColumns.component';
import { getFilters } from '@/pages/notebooks/_components/NotebookListFilters.component';
import DataTable from '@/components/data-table';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import { NotebookWithQpu } from '@/types/orderFunnel';

interface QpusListProps {
  qpus: NotebookWithQpu[];
}

export default function QpusList({ qpus }: QpusListProps) {
  const { t } = useTranslation('ai-tools/notebooks');
  const track = useTrackAction();
  const navigate = useNavigate();

  const columns: ColumnDef<NotebookWithQpu>[] = getColumns({
    onStartClicked: (notebook) => navigate(`./start/${notebook.id}`),
    onRestartClicked: (notebook) => navigate(`./restart/${notebook.id}`),
    onStopClicked: (notebook) => navigate(`./stop/${notebook.id}`),
    onDeleteClicked: (notebook) => navigate(`./delete/${notebook.id}`),
  });

  const notebooksFilters = getFilters();

  return (
    <DataTable.Provider
      columns={columns}
      data={qpus}
      pageSize={25}
      filtersDefinition={notebooksFilters}
    >
      <DataTable.Header>
        <DataTable.Action>
          <Button
            data-testid="create-notebook-button"
            onClick={() => {
              track(TRACKING.qpus.listing.createNotebooksClick(), 'listing');
              navigate('./new');
            }}
          >
            <Plus className="size-6" />
            {t('createNewNotebook')}
          </Button>
        </DataTable.Action>
        <DataTable.SearchBar />
        <DataTable.FiltersButton />
      </DataTable.Header>
      <DataTable.FiltersList />
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable.Provider>
  );
}

QpusList.Skeleton = function NotebooksListSkeleton() {
  return (
    <>
      <div
        data-testid="notebook-list-table-skeleton"
        className="flex justify-between w-100 mb-2 items-end"
      >
        <Skeleton className="h-20 w-48" />
        <div className="flex">
          <Skeleton className="h-20 w-48" />
          <Skeleton className="h-20 w-12 ml-2" />
        </div>
      </div>
      <DataTable.Skeleton columns={5} rows={10} width={100} height={16} />
    </>
  );
};
