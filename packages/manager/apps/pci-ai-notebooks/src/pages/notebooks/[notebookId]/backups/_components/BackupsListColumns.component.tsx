import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortableHeader } from '@/components/ui/data-table';
import * as ai from '@/types/cloud/project/ai';

interface BackupsListColumnsProps {
  onForkClicked: (backup: ai.notebook.Backup) => void;
}

export const getColumns = ({ onForkClicked }: BackupsListColumnsProps) => {
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/backups');
  const columns: ColumnDef<ai.notebook.Backup>[] = [
    {
      id: 'Id',
      accessorFn: (row) => row.id,
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeaderId')}</SortableHeader>
      ),
    },
    {
      id: 'CreationDate',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderCreationDate')}
        </SortableHeader>
      ),
    },
    {
      id: 'UpdateDate',
      accessorFn: (row) => row.updatedAt,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderUpdateDate')}
        </SortableHeader>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="backup-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="backup-action-content"
              align="end"
            >
              <DropdownMenuLabel>
                {t('backupDropdownMenuLabel')}
              </DropdownMenuLabel>
              <DropdownMenuItem
                data-testid="backup-action-fork-button"
                variant="primary"
                onClick={() => {
                  onForkClicked(row.original);
                }}
              >
                {t('tableActionFork')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
