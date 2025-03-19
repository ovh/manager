import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpRightFromSquare,
  Cpu,
  Globe,
  LockKeyhole,
  MoreHorizontal,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';

import Link from '@/components/links/Link.component';
import { convertSecondsToTimeString } from '@/lib/durationHelper';
import NotebookStatusBadge from './NotebookStatusBadge.component';

import A from '@/components/links/A.component';
import DataTable from '@/components/data-table';
import {
  isDeletingNotebook,
  isRunningNotebook,
  isStoppedNotebook,
} from '@/lib/statusHelper';

interface NotebooksListColumnsProps {
  onStartClicked: (notebook: ai.notebook.Notebook) => void;
  onStopClicked: (notebook: ai.notebook.Notebook) => void;
  onDeleteClicked: (notebook: ai.notebook.Notebook) => void;
}

export const getColumns = ({
  onStartClicked,
  onStopClicked,
  onDeleteClicked,
}: NotebooksListColumnsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('ai-tools/notebooks');
  const { t: tRegions } = useTranslation('regions');
  const columns: ColumnDef<ai.notebook.Notebook>[] = [
    {
      id: 'name/id',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => `${row.spec.name}-${row.id}`,
      cell: ({ row }) => {
        const { id, spec, status } = row.original;
        return (
          <div className="flex flex-col flex-nowrap text-left">
            {status.state === ai.notebook.NotebookStateEnum.DELETING ? (
              <span className="justify-normal px-0 h-auto leading-4 font-semibold py-2">
                {spec.name}
              </span>
            ) : (
              <Link to={id}>{spec.name}</Link>
            )}
            <span className="text-sm whitespace-nowrap">{id}</span>
          </div>
        );
      },
    },
    {
      id: 'Region',
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
      id: 'Framework',
      accessorFn: (row) => row.spec.env.frameworkId,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderFramework')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <span className="capitalize">{row.original.spec.env.frameworkId}</span>
      ),
    },
    {
      id: 'Editor',
      accessorFn: (row) => row.spec.env.editorId,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderEditor')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <Button
          className="capitalize font-semibold flex flex-row gap-1 items-center h-6 rounded-md px-2.5 py-0.5 text-xs"
          type="button"
          variant="primary"
          disabled={
            row.original.status.state !== ai.notebook.NotebookStateEnum.RUNNING
          }
        >
          <A
            href={row.original.status.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-row gap-1 items-center text-white capitalize">
              {row.original.spec.env.editorId}
              <ArrowUpRightFromSquare className="size-3" />
            </div>
          </A>
        </Button>
      ),
    },
    {
      id: 'Resources',
      accessorFn: (row) => row.spec.resources.cpu,
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
                <Zap className="size-4 shrink-0" />
                <span>{`${gpu} GPU ${gpuModel}`}</span>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Cpu className="size-4 shrink-0" />
                <span>{`${cpu} CPU`}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'Operating time',
      accessorFn: (row) => row.status.duration,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderDuration')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        const nbDuration = row.original.status?.duration || 0;
        return <span>{convertSecondsToTimeString(nbDuration, true)}</span>;
      },
    },
    {
      id: 'Privacy',
      accessorFn: () =>
        `${t('networkSecureTitle')} - ${t('networkPublicTitle')}`,
      header: t('tableHeaderPrivacy'),
      cell: ({ row }) => {
        const { unsecureHttp } = row.original.spec;
        return (
          <div>
            {unsecureHttp ? (
              <div className="flex gap-2 items-center">
                <Globe className="size-4 inline mr-2" />
                {t('networkPublicTitle')}
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <LockKeyhole className="size-4 inline mr-2" />
                {t('networkSecureTitle')}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'Status',
      accessorFn: (row) => row.status.state,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderStatus')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        return <NotebookStatusBadge status={row.original.status.state} />;
      },
    },

    {
      id: 'actions',
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const notebook = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="notebooks-action-trigger"
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
                data-testid="notebook-action-manage-button"
                variant="primary"
                onClick={() => navigate(`./${row.original.id}`)}
                disabled={
                  row.original.status.state ===
                  ai.notebook.NotebookStateEnum.DELETING
                }
              >
                {t('tableActionManage')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="notebook-action-start-button"
                disabled={
                  isRunningNotebook(notebook.status.state) ||
                  isDeletingNotebook(notebook.status.state)
                }
                variant="primary"
                onClick={() => {
                  onStartClicked(row.original);
                }}
              >
                {t('tableActionStart')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="notebook-action-stop-button"
                disabled={
                  !isRunningNotebook(notebook.status.state) ||
                  isDeletingNotebook(notebook.status.state)
                }
                variant="primary"
                onClick={() => {
                  onStopClicked(row.original);
                }}
              >
                {t('tableActionStop')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block w-full" tabIndex={0}>
                      <DropdownMenuItem
                        data-testid="notebook-action-delete-button"
                        variant="destructive"
                        disabled={
                          !isStoppedNotebook(notebook.status.state) ||
                          isDeletingNotebook(notebook.status.state)
                        }
                        onClick={() => {
                          onDeleteClicked(row.original);
                        }}
                      >
                        {t('tableActionDelete')}
                      </DropdownMenuItem>
                    </span>
                  </TooltipTrigger>
                  {!isStoppedNotebook(notebook.status.state) && (
                    <TooltipContent>{t('deleteTableTooltip')}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
