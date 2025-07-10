import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import DataTable from '@/components/data-table';

interface DatabasesTableColumnsProps {
  onDeleteClick: (topic: database.kafka.TopicAcl) => void;
}
export const getColumns = ({ onDeleteClick }: DatabasesTableColumnsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/topicAcls',
  );
  const columns: ColumnDef<database.kafka.TopicAcl>[] = [
    {
      id: 'username',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadUsername')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.username,
    },
    {
      id: 'topic',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadTopic')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.topic,
    },
    {
      id: 'permission',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadPermission')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.permission,
    },
    {
      id: MENU_COLUMN_ID,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="menu"
                  size="menu"
                  data-testid="topic-acl-action-trigger"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                data-testid="topic-acl-menu-content"
                align="end"
              >
                <DropdownMenuItem
                  data-testid="topic-action-delete-button"
                  variant="destructive"
                  disabled={
                    service.capabilities.topicAcl?.delete ===
                    database.service.capability.StateEnum.disabled
                  }
                  onClick={() => {
                    onDeleteClick(row.original);
                  }}
                  className="w-full"
                >
                  {t('tableActionDelete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  return columns;
};
