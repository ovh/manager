import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableHeader } from '@/components/ui/data-table';
import * as ai from '@/types/cloud/project/ai';
import { useToast } from '@/components/ui/use-toast';

export const getColumns = () => {
  const { t } = useTranslation(
    'pci-ai-notebooks/notebooks/notebook/public-git',
  );
  const toast = useToast();
  const columns: ColumnDef<ai.volume.Volume>[] = [
    {
      id: 'Url',
      accessorFn: (row) => row.volumeSource.publicGit.url,
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeaderUrl')}</SortableHeader>
      ),
    },
    {
      id: 'Mountpath',
      accessorFn: (row) => row.mountPath,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderMountPath')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-[200px] border border-1 border-primary-100">
            <Button
              data-testid="dashboard-copy-id-button"
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
      id: 'Permission',
      accessorFn: (row) => row.permission,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderPermission')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        return t(`permission_${row.original.permission}`);
      },
    },
  ];
  return columns;
};
