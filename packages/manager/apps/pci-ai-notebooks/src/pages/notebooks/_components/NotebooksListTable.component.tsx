import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './NotebooksListColumns.component';

interface NotebooksListProps {
  notebooks: ai.notebook.Notebook[];
  refetchFn: () => void;
}

export default function NotebooksList({
  notebooks,
  refetchFn,
}: NotebooksListProps) {
  /* const deleteModale = useModale('delete');
  
  const deletingService = useMemo(
    () => services.find((s) => s.id === deleteModale.value),
    [deleteModale.value, services],
  );
  */

  const columns: ColumnDef<ai.notebook.Notebook>[] = getColumns({
    onDeleteClicked: (notebook: ai.notebook.Notebook) => {
      console.log(notebook);
    },
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={notebooks}
        pageSize={25}
        // itemNumber={notebooks.length}
      />
      {/* 
      {deletingService && (
        <DeleteService
          controller={deleteModale.controller}
          service={deletingService}
          onSuccess={() => {
            deleteModale.close();
            refetchFn();
          }}
        />
      )}
      */}
    </>
  );
}

NotebooksList.Skeleton = function NotebooksListSkeleton() {
  return (
    <>
      <div
        data-testid="notebook-list-table-skeleton"
        className="flex justify-between w-100 mb-2 items-end"
      >
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-12 ml-2" />
        </div>
      </div>
      <DataTable.Skeleton columns={5} rows={10} width={100} height={16} />
    </>
  );
};
