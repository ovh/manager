import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Files, MoreHorizontal } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import ai from '@/types/AI';

interface GitColumnListProps {
  updateMode: boolean;
  onDeletVolume?: (volume: ai.volume.Volume) => void;
  status: string;
}

export const getColumns = ({
  onDeletVolume,
  updateMode,
  status,
}: GitColumnListProps) => {
  const { t } = useTranslation('ai-tools/components/public-git');
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
          <div className="w-full border rounded-md">
            <Button
              data-testid="public-git-copy-mountpath-button"
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

  if (updateMode) {
    columns.push({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="public-git-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block" tabIndex={0}>
                      <DropdownMenuItem
                        data-testid="public-git-action-delete-button"
                        variant="destructive"
                        onClick={() => {
                          onDeletVolume(row.original);
                        }}
                        disabled={
                          status !== ai.notebook.NotebookStateEnum.STOPPED
                        }
                      >
                        {t('tableActionDelete')}
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return columns;
};
