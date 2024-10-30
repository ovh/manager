import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './NotebooksListColumns.component';
import { useModale } from '@/hooks/useModale';
import DeleteNotebook from '../[notebookId]/_components/DeleteNotebook.component';
import StartNotebook from '../[notebookId]/_components/StartNotebook.component';
import StopNotebook from '../[notebookId]/_components/StopNotebook.component';

interface NotebooksListProps {
  notebooks: ai.notebook.Notebook[];
  refetchFn: () => void;
}

export default function NotebooksList({
  notebooks,
  refetchFn,
}: NotebooksListProps) {
  const startModale = useModale('start');
  const stopModale = useModale('stop');
  const deleteModale = useModale('delete');

  const startingNotebook = useMemo(
    () => notebooks.find((s) => s.id === startModale.value),
    [startModale.value, notebooks],
  );
  const stoppingNotebook = useMemo(
    () => notebooks.find((s) => s.id === stopModale.value),
    [stopModale.value, notebooks],
  );

  const deletingNotebook = useMemo(
    () => notebooks.find((s) => s.id === deleteModale.value),
    [deleteModale.value, notebooks],
  );

  const columns: ColumnDef<ai.notebook.Notebook>[] = getColumns({
    onStartClicked: (notebook: ai.notebook.Notebook) => {
      startModale.open(notebook.id);
    },
    onStopClicked: (notebook: ai.notebook.Notebook) => {
      stopModale.open(notebook.id);
    },
    onDeleteClicked: (notebook: ai.notebook.Notebook) => {
      deleteModale.open(notebook.id);
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
      {deletingNotebook && (
        <DeleteNotebook
          controller={deleteModale.controller}
          notebook={deletingNotebook}
          onSuccess={() => {
            deleteModale.close();
            refetchFn();
          }}
        />
      )}
      {startingNotebook && (
        <StartNotebook
          controller={startModale.controller}
          notebook={startingNotebook}
          onSuccess={() => {
            startModale.close();
            refetchFn();
          }}
        />
      )}
      {stoppingNotebook && (
        <StopNotebook
          controller={stopModale.controller}
          notebook={stoppingNotebook}
          onSuccess={() => {
            stopModale.close();
            refetchFn();
          }}
        />
      )}
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
