import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Badge } from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import { DatatableSortableHeader } from '@/components/data-table/DatatableSortableHeader.component';
import * as database from '@/types/cloud/project/database';

interface PatternSubRowProps {
  user: database.opensearch.User;
}
const PatternSubRow = ({ user }: PatternSubRowProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const columns: ColumnDef<database.opensearch.UserAcl>[] = [
    {
      id: 'pattern',
      header: ({ column }) => (
        <DatatableSortableHeader column={column}>
          {t('tableHeadPattern')}
        </DatatableSortableHeader>
      ),
      accessorFn: (row) => row.pattern,
    },
    {
      id: 'permission',
      header: ({ column }) => (
        <DatatableSortableHeader column={column}>
          {t('tableHeadPermission')}
        </DatatableSortableHeader>
      ),
      accessorFn: (row) => row.permission,
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.permission}</Badge>
      ),
    },
  ];
  return (
    <DataTable.Provider columns={columns} data={user.acls} pageSize={10} />
  );
};

export default PatternSubRow;
