import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Files, MoreHorizontal } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import DataTable from '@/components/data-table';
import { isDataSync } from '@/lib/statusHelper';

interface VolumesListColumnsProps {
  onDataSyncClicked: (volume: ai.volume.Volume) => void;
  updateMode: boolean;
  onDeletVolume?: (volume: ai.volume.Volume) => void;
  status: string;
}

export const getColumns = ({
  onDataSyncClicked,
  onDeletVolume,
  updateMode,
  status,
}: VolumesListColumnsProps) => {
  const { t } = useTranslation('ai-tools/components/containers');
  const toast = useToast();
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
          <div className="w-full border rounded-md">
            <Button
              data-testid="containers-copy-mountpath-button"
              type="button"
              className="w-full flex justify-between items-center border-0"
              size="sm"
              mode="outline"
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
                disabled={!isDataSync(status)}
              >
                {t('tableActionSyncData')}
              </DropdownMenuItem>
              {updateMode && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-block" tabIndex={0}>
                        <DropdownMenuItem
                          data-testid="container-action-delete-button"
                          variant="destructive"
                          onClick={() => {
                            onDeletVolume(row.original);
                          }}
                          disabled={
                            status !== ai.notebook.NotebookStateEnum.STOPPED
                          }
                        >
                          {t('deleteAction')}
                        </DropdownMenuItem>
                      </span>
                    </TooltipTrigger>
                    {status !== ai.notebook.NotebookStateEnum.STOPPED && (
                      <TooltipContent>
                        {t('disabledButtonTooltip')}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
