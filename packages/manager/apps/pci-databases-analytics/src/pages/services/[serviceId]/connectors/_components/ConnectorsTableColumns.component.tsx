import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  BadgeProps,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import DataTable from '@/components/data-table';
import { ConnectorWithCapability } from '../Connectors.page';
import A from '@/components/links/A.component';

interface ConnectorsTableColumnsProps {
  onDeleteClick: (topic: ConnectorWithCapability) => void;
  onEditClick: (topic: ConnectorWithCapability) => void;
  onTasksClick: (topic: ConnectorWithCapability) => void;
  onStartClick: (topic: ConnectorWithCapability) => void;
  onPauseClick: (topic: ConnectorWithCapability) => void;
  onRestartClick: (topic: ConnectorWithCapability) => void;
}
export const getColumns = ({
  onDeleteClick,
  onEditClick,
  onTasksClick,
  onPauseClick,
  onRestartClick,
  onStartClick,
}: ConnectorsTableColumnsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/connectors',
  );
  const columns: ColumnDef<ConnectorWithCapability>[] = [
    {
      id: 'name',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.name,
    },
    {
      id: 'connector',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadConnector')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.capabilities.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="bg-blue-400 text-white rounded-full size-8 flex items-center justify-center">
            {row.original.capabilities.type ===
              database.kafkaConnect.capabilities.connector.TypeEnum.sink && (
              <ArrowDown className="w-4" />
            )}
            {row.original.capabilities.type ===
              database.kafkaConnect.capabilities.connector.TypeEnum.source && (
              <ArrowUp className="w-4" />
            )}
          </span>
          <div className="flex-1">
            <h6>{row.original.capabilities.name}</h6>
            <div>
              <span>Version: {row.original.capabilities.version}</span>
              <span> | Author: {row.original.capabilities.author}</span>
              {row.original.capabilities.documentationUrl && (
                <span>
                  {' '}
                  |{' '}
                  <A
                    target="_blank"
                    href={row.original.capabilities.documentationUrl}
                  >
                    docs
                  </A>
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadStatus')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.status,
      cell: ({ row }) => {
        let badgeVariant: BadgeProps['variant'] = 'primary';
        switch (row.original.status) {
          case database.kafkaConnect.connector.StatusEnum.RUNNING:
            badgeVariant = 'success';
            break;
          case database.kafkaConnect.connector.StatusEnum.CREATING:
          case database.kafkaConnect.connector.StatusEnum.UNASSIGNED:
          case database.kafkaConnect.connector.StatusEnum.PAUSED:
            badgeVariant = 'warning';
            break;
          case database.kafkaConnect.connector.StatusEnum.FAILED:
            badgeVariant = 'destructive';
            break;
          default:
            badgeVariant = 'primary';
            break;
        }
        return <Badge variant={badgeVariant}>{row.original.status}</Badge>;
      },
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
                  data-testid="connector-action-trigger"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                data-testid="connector-menu-content"
                align="end"
              >
                <DropdownMenuLabel>{t('tableActionLabel')}</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    data-testid="connector-action-tasks-button"
                    onClick={() => {
                      onTasksClick(row.original);
                    }}
                    className="w-full"
                  >
                    {t('tableActionTasks')}
                  </DropdownMenuItem>
                  {database.kafkaConnect.connector.StatusEnum.PAUSED !==
                    row.original.status && (
                    <DropdownMenuItem
                      data-testid="connector-action-pause-button"
                      disabled={
                        row.original.status !==
                        database.kafkaConnect.connector.StatusEnum.RUNNING
                      }
                      onClick={() => {
                        onPauseClick(row.original);
                      }}
                      className="w-full"
                    >
                      {' '}
                      {t('tableActionPause')}
                    </DropdownMenuItem>
                  )}
                  {database.kafkaConnect.connector.StatusEnum.PAUSED ===
                    row.original.status && (
                    <DropdownMenuItem
                      data-testid="connector-action-start-button"
                      onClick={() => {
                        onStartClick(row.original);
                      }}
                      className="w-full"
                    >
                      {t('tableActionResume')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    data-testid="connector-action-restart-button"
                    onClick={() => {
                      onRestartClick(row.original);
                    }}
                    className="w-full"
                  >
                    {t('tableActionRestart')}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-testid="connector-action-edit-button"
                  disabled={
                    service.capabilities.connector?.update ===
                    database.service.capability.StateEnum.disabled
                  }
                  onClick={() => {
                    onEditClick(row.original);
                  }}
                  className="w-full"
                >
                  {t('tableActionEdit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-testid="connector-action-delete-button"
                  variant="destructive"
                  disabled={
                    service.capabilities.connector?.delete ===
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
