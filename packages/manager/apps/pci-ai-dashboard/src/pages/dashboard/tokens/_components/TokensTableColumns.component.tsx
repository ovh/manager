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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import * as ai from '@/types/cloud/project/ai';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { Badge } from '@/components/ui/badge';

interface TokensTableColumnsProps {
  onRegenerateClick: (token: ai.token.Token) => void;
  onDeleteClick: (token: ai.token.Token) => void;
}
export const getColumns = ({
  onRegenerateClick,
  onDeleteClick,
}: TokensTableColumnsProps) => {
  const { t } = useTranslation('pci-ai-dashboard/tokens');
  const { t: tRegions } = useTranslation('regions');
  const columns: ColumnDef<ai.token.Token>[] = [
    {
      id: 'name',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadName')}</SortableHeader>
      ),
      accessorFn: (row) => row.spec.name,
    },
    {
      id: 'label',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadLabel')}</SortableHeader>
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
        <SortableHeader column={column}>{t('tableHeadRegion')}</SortableHeader>
      ),
      accessorFn: (row) => tRegions(`region_${row.spec.region}`),
    },
    {
      id: 'role',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadRole')}</SortableHeader>
      ),
      accessorFn: (row) => t(row.spec.role),
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
