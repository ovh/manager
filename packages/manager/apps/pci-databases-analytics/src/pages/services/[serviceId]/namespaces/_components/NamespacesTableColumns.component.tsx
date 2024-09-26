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

import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';

import * as database from '@/types/cloud/project/database';
import { durationStringToHuman } from '@/lib/durationHelper';
import { useServiceData } from '../../Service.context';

interface NamespacesTableColumnsProps {
  onEditClick: (namespace: database.m3db.Namespace) => void;
  onDeleteClick: (namespace: database.m3db.Namespace) => void;
}
export const getColumns = ({
  onEditClick,
  onDeleteClick,
}: NamespacesTableColumnsProps) => {
  const { service } = useServiceData();
  const dateLocale = useDateFnsLocale();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/namespaces',
  );
  const columns: ColumnDef<database.m3db.Namespace>[] = [
    {
      id: 'name',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadName')}</SortableHeader>
      ),
      accessorFn: (row) => row.name,
    },
    {
      id: 'type',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadType')}</SortableHeader>
      ),
      accessorFn: (row) => row.type,
    },
    {
      id: 'retention',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadRetentionTime')}
        </SortableHeader>
      ),
      accessorFn: (row) =>
        durationStringToHuman(row.retention.periodDuration, dateLocale),
    },
    {
      id: 'resolution',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadResolution')}
        </SortableHeader>
      ),
      accessorFn: (row) => durationStringToHuman(row.resolution, dateLocale),
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
                      data-testid="namespaces-action-trigger"
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
                      {service.capabilities.namespaces?.update && (
                        <DropdownMenuItem
                          data-testid="namespaces-action-edit-button"
                          variant="primary"
                          disabled={
                            service.capabilities.namespaces?.update ===
                            database.service.capability.StateEnum.disabled
                          }
                          onClick={() => {
                            onEditClick(row.original);
                          }}
                          className="w-full"
                        >
                          {t('tableActionEdit')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {service.capabilities.namespaces?.delete && (
                        <DropdownMenuItem
                          data-testid="namespaces-action-delete-button"
                          variant="destructive"
                          disabled={
                            service.capabilities.namespaces?.delete ===
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
