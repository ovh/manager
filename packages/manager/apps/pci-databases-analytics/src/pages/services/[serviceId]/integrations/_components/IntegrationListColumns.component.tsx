import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { SortableHeader } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import UserStatusBadge from '../../users/_components/UserStatusBadge.component';
import { IntegrationWithServices } from '../Integrations.page';
import IntegrationServiceLink from './IntegrationServiceLink.component';

interface IntegrationsTableColumnsProps {
  onDeleteClick: (db: database.service.Integration) => void;
}
export const getColumns = ({
  onDeleteClick,
}: IntegrationsTableColumnsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/integrations',
  );
  const columns: ColumnDef<IntegrationWithServices>[] = [
    {
      id: 'source',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadSource')}</SortableHeader>
      ),
      accessorFn: (row) => row.source.description,
      cell: ({ row }) => (
        <IntegrationServiceLink service={row.original.source} />
      ),
    },
    {
      id: 'destination',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadDestination')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.destination.description,
      cell: ({ row }) => (
        <IntegrationServiceLink service={row.original.destination} />
      ),
    },
    {
      id: 'type',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadType')}</SortableHeader>
      ),
      accessorFn: (row) => row.type,
    },
    {
      id: 'status',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadStatus')}</SortableHeader>
      ),
      accessorFn: (row) => row.status,
      cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  data-testid="integrations-action-trigger"
                  variant="menu"
                  size="menu"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                data-testid="integrations-action-content"
                align="end"
              >
                {service.capabilities.integrations?.delete && (
                  <DropdownMenuItem
                    data-testid="integrations-action-delete-button"
                    variant="destructive"
                    disabled={
                      service.capabilities.integrations?.delete ===
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  return columns;
};
