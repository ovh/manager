import { ColumnDef } from '@tanstack/react-table';
import { Cpu, MoreHorizontal, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import { useNavigate } from 'react-router-dom';
import ai from '@/types/AI';
import Link from '@/components/links/Link.component';
import DataTable from '@/components/data-table';

import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import AppStatusBadge from './AppStatusBadge.component';
import { isDeletingApp, isRunningApp, isStoppedApp } from '@/lib/statusHelper';

interface AppsListColumnsProps {
  onStartClicked: (app: ai.app.App) => void;
  onStopClicked: (app: ai.app.App) => void;
  onDeleteClicked: (app: ai.app.App) => void;
}

export const getColumns = ({
  onStartClicked,
  onStopClicked,
  onDeleteClicked,
}: AppsListColumnsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('ai-tools/apps');
  const { t: tRegions } = useTranslation('regions');
  const columns: ColumnDef<ai.app.App>[] = [
    {
      id: 'name/id',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => `${row.spec.name}-${row.id}`,
      cell: ({ row }) => {
        const { id, spec } = row.original;
        return (
          <div className="flex flex-col flex-nowrap text-left">
            <Link to={id}>{spec.name}</Link>
            <span className="text-sm whitespace-nowrap">{id}</span>
          </div>
        );
      },
    },
    {
      id: 'image/partner',
      accessorFn: (row) => row.spec.image,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderImage')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col flex-nowrap text-left">
            <p>{row.original.spec.image}</p>
            {row.original.spec.partnerId && (
              <span className="text-sm whitespace-nowrap mt-1">
                {t('tableImagePartner', {
                  partner: row.original.spec.partnerId,
                })}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'region',
      accessorFn: (row) => row.spec.region,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderLocation')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <span>{tRegions(`region_${row.original.spec.region}`)}</span>
      ),
    },
    {
      id: 'resources',
      accessorFn: (row) => row.spec.resources,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderResources')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        const { cpu, gpu, gpuModel } = row.original.spec.resources;
        return (
          <div>
            {gpu > 0 ? (
              <div className="flex gap-2 items-center">
                <Zap className="size-4" />
                <span>{`${gpu} GPU ${gpuModel}`}</span>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Cpu className="size-4" />
                <span>{`${cpu} CPU`}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'replicas',
      accessorFn: (row) => row.spec.scalingStrategy,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderReplicas')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        const replicas = row.original.spec.scalingStrategy?.fixed
          ? row.original.spec.scalingStrategy?.fixed.replicas
          : row.original.spec.scalingStrategy?.automatic?.replicasMin;
        return (
          <span>
            {t('tableReplic', {
              rep: replicas,
            })}
          </span>
        );
      },
    },
    {
      id: 'update-date',
      accessorFn: (row) => row.updatedAt,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderUpdateDate')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <span>
          <FormattedDate date={new Date(row.original.updatedAt)} />
        </span>
      ),
    },
    {
      id: 'status',
      accessorFn: (row) => row.status.state,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderStatus')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        return <AppStatusBadge status={row.original.status.state} />;
      },
    },

    {
      id: 'actions',
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const app = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="apps-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="services-action-content"
              align="end"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                data-testid="app-action-manage-button"
                variant="primary"
                onClick={() => navigate(`./${row.original.id}`)}
              >
                {t('tableActionManage')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="app-action-start-button"
                disabled={
                  isRunningApp(app.status.state) ||
                  isDeletingApp(app.status.state)
                }
                variant="primary"
                onClick={() => {
                  onStartClicked(row.original);
                }}
              >
                {t('tableActionStart')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="app-action-stop-button"
                disabled={
                  !isRunningApp(app.status.state) ||
                  isDeletingApp(app.status.state)
                }
                variant="primary"
                onClick={() => {
                  onStopClicked(row.original);
                }}
              >
                {t('tableActionStop')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="app-action-delete-button"
                variant="destructive"
                disabled={
                  !isStoppedApp(app.status.state) ||
                  isDeletingApp(app.status.state)
                }
                onClick={() => {
                  onDeleteClicked(row.original);
                }}
              >
                {t('tableActionDelete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
