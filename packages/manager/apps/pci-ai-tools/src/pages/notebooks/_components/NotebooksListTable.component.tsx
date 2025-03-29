import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { getColumns } from './NotebooksListColumns.component';
import { getFilters } from './NotebookListFilters.component';
import DataTable from '@/components/data-table';

interface NotebooksListProps {
  notebooks: ai.notebook.Notebook[];
}

export default function NotebooksList({ notebooks }: NotebooksListProps) {
  const { t } = useTranslation('ai-tools/notebooks');
  const navigate = useNavigate();

  const columns: ColumnDef<ai.notebook.Notebook>[] = getColumns({
    onStartClicked: (notebook: ai.notebook.Notebook) => {
      navigate(`./start/${notebook.id}`);
    },
    onStopClicked: (notebook: ai.notebook.Notebook) => {
      navigate(`./stop/${notebook.id}`);
    },
    onDeleteClicked: (notebook: ai.notebook.Notebook) => {
      navigate(`./delete/${notebook.id}`);
    },
  });

  const notebooksFilters = getFilters();

  return (
    <DataTable.Provider
      columns={columns}
      data={notebooks}
      pageSize={25}
      filtersDefinition={notebooksFilters}
    >
      <DataTable.Header>
        <DataTable.Action>
          <Button
            data-testid="create-notebook-button"
            onClick={() => {
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

NotebooksList.Skeleton = function NotebooksListSkeleton() {
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
