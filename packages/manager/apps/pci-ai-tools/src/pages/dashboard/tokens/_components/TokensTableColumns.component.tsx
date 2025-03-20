import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import DataTable from '@/components/data-table';

interface TokensTableColumnsProps {
  onRegenerateClick: (token: ai.token.Token) => void;
  onDeleteClick: (token: ai.token.Token) => void;
}
export const getColumns = ({
  onRegenerateClick,
  onDeleteClick,
}: TokensTableColumnsProps) => {
  const { t } = useTranslation('ai-tools/dashboard/tokens');
  const { t: tRegions } = useTranslation('regions');
  const columns: ColumnDef<ai.token.Token>[] = [
    {
      id: 'name',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.spec.name,
    },
    {
      id: 'label',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadLabel')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.spec.labelSelector,
      cell: ({ row }) => {
        return (
          row.original.spec.labelSelector && (
            <Badge variant="success">{row.original.spec.labelSelector}</Badge>
          )
        );
      },
    },
    {
      id: 'region',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadRegion')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => tRegions(`region_${row.spec.region}`),
    },
    {
      id: 'role',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadRole')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => t(row.spec.role),
    },
    {
      id: 'creation date',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadCreationDate')}
        </DataTable.SortableHeader>
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
                      data-testid="token-action-trigger"
                      variant="menu"
                      size="menu"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-testid="token-action-content"
                    align="end"
                  >
                    <TooltipTrigger className="w-full">
                      <DropdownMenuItem
                        data-testid="token-action-renew-button"
                        variant="primary"
                        onClick={() => {
                          onRegenerateClick(row.original);
                        }}
                        className="w-full"
                      >
                        {t('tableActionRegenerate')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        data-testid="token-action-delete-button"
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
