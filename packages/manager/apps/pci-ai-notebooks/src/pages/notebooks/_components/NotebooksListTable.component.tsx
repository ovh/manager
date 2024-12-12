import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './NotebooksListColumns.component';

interface NotebooksListProps {
  notebooks: ai.notebook.Notebook[];
}

export default function NotebooksList({ notebooks }: NotebooksListProps) {
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

  return <DataTable columns={columns} data={notebooks} pageSize={25} />;
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
