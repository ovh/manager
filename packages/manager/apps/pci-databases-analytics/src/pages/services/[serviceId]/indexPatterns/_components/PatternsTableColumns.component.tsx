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

import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';

interface PatternsTableColumnsProps {
  onDeleteClick: (pattern: database.opensearch.Pattern) => void;
}
export const getPatternsColumns = ({
  onDeleteClick,
}: PatternsTableColumnsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/indexPatterns',
  );
  const columns: ColumnDef<database.opensearch.Pattern>[] = [
    {
      id: 'pattern',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tablePatternHeadPattern')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.pattern,
    },
    {
      id: 'maxIndexCount',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tablePatternHeadMaxIndexCound')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.maxIndexCount,
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
                      data-testid="patterns-action-trigger"
                      variant="menu"
                      size="menu"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-testid="namepaces-action-content"
                    align="end"
                  >
                    <TooltipTrigger className="w-full">
                      {service.capabilities.patterns?.delete && (
                        <DropdownMenuItem
                          data-testid="patterns-action-delete-button"
                          variant="destructive"
                          disabled={
                            service.capabilities.patterns?.delete ===
                            database.service.capability.StateEnum.disabled
                          }
                          onClick={() => {
                            onDeleteClick(row.original);
                          }}
                          className="w-full"
                        >
                          {t('tableActionDelete')}
                        </DropdownMenuItem>
                      )}
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
