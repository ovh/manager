import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as ai from '@/types/cloud/project/ai';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/data-table';

export const getColumns = () => {
  const { t } = useTranslation('components/public-git');
  const toast = useToast();
  const columns: ColumnDef<ai.volume.Volume>[] = [
    {
      id: 'url',
      accessorFn: (row) => row.volumeSource.publicGit.url,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderUrl')}
        </DataTable.SortableHeader>
      ),
    },
    {
      id: 'mountpath',
      accessorFn: (row) => row.mountPath,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderMountPath')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        return (
          <div className="w-full border border-1 border-primary-100">
            <Button
              data-testid="public-git-copy-mountpath-button"
              type="button"
              className="w-full flex justify-between items-center p-4 border-0"
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(row.original.mountPath);
                toast.toast({
                  title: t('mountPathCopyToast'),
                });
              }}
            >
              <span className="truncate max-w-[150px] overflow-hidden text-ellipsis">
                {row.original.mountPath}
              </span>
              <Files className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
    {
      id: 'permission',
      accessorFn: (row) => row.permission,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderPermission')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        return t(`permission_${row.original.permission}`);
      },
    },
  ];
  return columns;
};
