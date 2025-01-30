import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
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
import Link from '@/components/links/Link.component';
import DataTable from '@/components/data-table';

import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import JobStatusBadge from './JobStatusBadge.component';

interface JobsListColumnsProps {
  onRestartClicked: (job: ai.job.Job) => void;
  onStopClicked: (job: ai.job.Job) => void;
  onDeleteClicked: (job: ai.job.Job) => void;
}

export const getColumns = ({
  onRestartClicked,
  onStopClicked,
  onDeleteClicked,
}: JobsListColumnsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('pci-ai-training/jobs');
  const { t: tRegions } = useTranslation('regions');
  const columns: ColumnDef<ai.job.Job>[] = [
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
            <Button
              asChild
              variant="link"
              className="justify-normal px-0 h-auto leading-4 font-semibold"
            >
              <Link to={id}>{spec.name}</Link>
            </Button>
            <span className="text-sm whitespace-nowrap">{id}</span>
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
      id: 'docker',
      accessorFn: (row) => row.spec.image,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderImage')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => <span>{row.original.spec.image}</span>,
    },
    {
      id: 'Creation date',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderCreationDate')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <span>
          <FormattedDate date={new Date(row.original.createdAt)} />
        </span>
      ),
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
        return <JobStatusBadge status={row.original.status.state} />;
      },
    },

    {
      id: 'actions',
      enableGlobalFilter: false,
      cell: ({ row }) => {
        // const job = row.original;
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
              >
                {t('tableActionManage')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="notebook-action-start-button"
                // disabled={
                //   isRunningNotebook(notebook.status.state) ||
                //   isDeletingNotebook(notebook.status.state)
                // }
                variant="primary"
                onClick={() => {
                  onRestartClicked(row.original);
                }}
              >
                {t('tableActionRestart')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="notebook-action-stop-button"
                // disabled={
                //   !isRunningNotebook(notebook.status.state) ||
                //   isDeletingNotebook(notebook.status.state)
                // }
                variant="primary"
                onClick={() => {
                  onStopClicked(row.original);
                }}
              >
                {t('tableActionStop')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="notebook-action-delete-button"
                variant="destructive"
                // disabled={
                //   !isStoppedNotebook(notebook.status.state) ||
                //   isDeletingNotebook(notebook.status.state)
                // }
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
