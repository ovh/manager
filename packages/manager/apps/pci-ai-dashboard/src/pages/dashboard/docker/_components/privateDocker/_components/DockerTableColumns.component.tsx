import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { SortableHeader } from '@/components/ui/data-table';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import * as ai from '@/types/cloud/project/ai';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';

interface DockerTableColumnsProps {
  onDeleteClick: (registry: ai.registry.Registry) => void;
}
export const getColumns = ({ onDeleteClick }: DockerTableColumnsProps) => {
  const { t } = useTranslation('pci-ai-dashboard/docker');
  const { t: tRegions } = useTranslation('regions');
  const columns: ColumnDef<ai.registry.Registry>[] = [
    {
      id: 'id',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadId')}</SortableHeader>
      ),
      accessorFn: (row) => row.id,
    },
    {
      id: 'region',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadRegion')}</SortableHeader>
      ),
      accessorFn: (row) => tRegions(`region_${row.region}`),
    },
    {
      id: 'url',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadUrl')}</SortableHeader>
      ),
      accessorFn: (row) => row.url,
    },
    {
      id: 'username',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadUsername')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.username,
    },
    {
      id: 'user',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadUser')}</SortableHeader>
      ),
      accessorFn: (row) => row.user,
    },
    {
      id: 'creation date',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadCreationDate')}
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <FormattedDate
          date={new Date(row.original.createdAt)}
          options={{
            dateStyle: 'medium',
            timeStyle: 'medium',
          }}
        />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      data-testid="docker-action-trigger"
                      variant="menu"
                      size="menu"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-testid="docker-action-content"
                    align="end"
                  >
                    <TooltipTrigger className="w-full">
                      <DropdownMenuItem
                        data-testid="docker-action-delete-button"
                        variant="destructive"
                        onClick={() => {
                          onDeleteClick(row.original);
                        }}
                        className="w-full"
                      >
                        {t('tableActionDelete')}
                      </DropdownMenuItem>
                    </TooltipTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];
  return columns;
};
