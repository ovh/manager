import { TFunction } from 'i18next';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { DatatableSortableHeader } from '@/components/data-table/DatatableSortableHeader.component';

interface PatternsTableColumnsProps {
  onDeleteClick: (pattern: database.opensearch.Pattern) => void;
  service: database.Service;
  t: TFunction;
}
export const getPatternsColumns = ({
  onDeleteClick,
  service,
  t,
}: PatternsTableColumnsProps) => {
  const columns: ColumnDef<database.opensearch.Pattern>[] = [
    {
      id: 'pattern',
      header: ({ column }) => (
        <DatatableSortableHeader column={column}>
          {t('tablePatternHeadPattern')}
        </DatatableSortableHeader>
      ),
      accessorFn: (row) => row.pattern,
    },
    {
      id: 'maxIndexCount',
      header: ({ column }) => (
        <DatatableSortableHeader column={column}>
          {t('tablePatternHeadMaxIndexCound')}
        </DatatableSortableHeader>
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
