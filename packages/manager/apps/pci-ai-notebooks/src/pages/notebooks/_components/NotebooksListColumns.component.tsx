import { ColumnDef } from '@tanstack/react-table';
import {
  Cpu,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as ai from '@/types/cloud/project/ai';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortableHeader } from '@/components/ui/data-table';
import Link from '@/components/links/Link.component';
import { convertSecondsToTimeString } from '@/lib/durationHelper';
import NotebookStatusBadge from './NotebookStatusBadge.component';
import { isDeletingNotebook, isRunningNotebook } from '@/lib/statusHelper';

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
  const { t } = useTranslation('pci-ai-notebooks/notebooks');
  const { t: tRegions } = useTranslation('regions');
  const columns: ColumnDef<ai.notebook.Notebook>[] = [
    {
      id: 'name/id',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeaderName')}</SortableHeader>
      ),
      accessorFn: (row) => row.spec.name,
      cell: ({ row }) => {
        const { id, spec, status } = row.original;
        return (
          <div className="flex flex-col flex-nowrap text-left">
            {status.state === ai.notebook.NotebookStateEnum.DELETING ? (
              <span className="justify-normal px-0 h-auto leading-4 font-semibold py-2">
                {spec.name}
              </span>
            ) : (
              <Button
                asChild
                variant="link"
                className="justify-normal px-0 h-auto leading-4 font-semibold"
              >
                <Link to={id}>{spec.name}</Link>
              </Button>
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
        <SortableHeader column={column}>
          {t('tableHeaderLocation')}
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <span>{tRegions(`region_${row.original.spec.region}`)}</span>
      ),
    },
    {
      id: 'Environment',
      accessorFn: (row) =>
        `${row.spec.env.frameworkId} - ${row.spec.env.frameworkVersion}`,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderEnvironment')}
        </SortableHeader>
      ),
    },
    {
      id: 'Resources',
      accessorFn: (row) => row.spec.env,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderResources')}
        </SortableHeader>
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
      id: 'Operating time',
      accessorFn: (row) => convertSecondsToTimeString(row.status.duration),
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderDuration')}
        </SortableHeader>
      ),
    },
    {
      id: 'Privacy',
      accessorFn: (row) => row.spec.unsecureHttp,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderPrivacy')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const { unsecureHttp } = row.original.spec;
        return (
          <div>
            {unsecureHttp ? (
              <div className="flex gap-2 items-center">
                <ShieldCheck className="size-4 inline mr-2 text-green-500" />
                {t('networkSecureTitle')}
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <ShieldAlert className="size-4 inline mr-2 text-amber-400" />
                {t('networkPublicTitle')}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'Status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderStatus')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        return <NotebookStatusBadge status={row.original.status.state} />;
      },
    },
    {
      id: 'actions',
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

              <DropdownMenuItem
                variant="destructive"
                disabled={
                  isRunningNotebook(notebook.status.state) ||
                  isDeletingNotebook(notebook.status.state)
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
