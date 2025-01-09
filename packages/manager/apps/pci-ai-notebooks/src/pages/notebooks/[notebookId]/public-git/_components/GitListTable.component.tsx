import { ColumnDef } from '@tanstack/react-table';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './GitListColumns.component';
import { DataTable } from '@/components/ui/data-table';

interface GitListProps {
  git: ai.volume.Volume[];
}

export default function GitList({ git }: Readonly<GitListProps>) {
  const columns: ColumnDef<ai.volume.Volume>[] = getColumns();

  return <DataTable columns={columns} data={git} pageSize={25} />;
}
