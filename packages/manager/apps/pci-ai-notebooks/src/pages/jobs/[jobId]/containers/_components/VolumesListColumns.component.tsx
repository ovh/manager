import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Files, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as ai from '@/types/cloud/project/ai';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/data-table';
import { useJobData } from '../../Job.context';
import { isDataSyncJob } from '@/lib/jobHelper';

interface VolumesListColumnsProps {
  onDataSyncClicked: (volume: ai.volume.Volume) => void;
}

export const getColumns = ({ onDataSyncClicked }: VolumesListColumnsProps) => {
  const { t } = useTranslation(
    'pci-ai-notebooks/notebooks/notebook/containers',
  );
  const toast = useToast();
  const { job } = useJobData();
  const columns: ColumnDef<ai.volume.Volume>[] = [
    {
      id: 'Alias',
      accessorFn: (row) => row.volumeSource.dataStore.alias,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderAlias')}
        </DataTable.SortableHeader>
      ),
    },
    {
      id: 'Container',
      accessorFn: (row) => row.volumeSource.dataStore.container,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderContainer')}
        </DataTable.SortableHeader>
      ),
    },
    {
      id: 'Mountpath',
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
              data-testid="containers-copy-mountpath-button"
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
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderPermission')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        return t(`permission_${row.original.permission}`);
      },
    },
    {
      id: 'Caching',
      accessorFn: (row) => row.cache,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderCaching')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        return row.original.cache
          ? t('tableWithCache')
          : t('tableWithoutCache');
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="container-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="services-action-content"
              align="end"
            >
              <DropdownMenuLabel>
                {t('synchDataDropdownMenuLabel')}
              </DropdownMenuLabel>
              <DropdownMenuItem
                data-testid="container-action-data-sync-button"
                variant="primary"
                onClick={() => {
                  onDataSyncClicked(row.original);
                }}
                disabled={!isDataSyncJob(job.status.state)}
              >
                {t('tableActionSyncData')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
