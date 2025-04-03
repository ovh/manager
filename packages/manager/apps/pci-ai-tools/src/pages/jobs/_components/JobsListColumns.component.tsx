import { ColumnDef } from '@tanstack/react-table';
import { Cpu, MoreHorizontal, Zap } from 'lucide-react';
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
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import Link from '@/components/links/Link.component';
import DataTable from '@/components/data-table';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import JobStatusBadge from './JobStatusBadge.component';
import { isRunningJob, isStoppedJob } from '@/lib/statusHelper';
import { convertSecondsToTimeString } from '@/lib/durationHelper';

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
  const { t } = useTranslation('ai-tools/jobs');
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
            <Link to={id}>{spec.name}</Link>
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
      accessorFn: (row) =>
        convertSecondsToTimeString(row.status.duration, true),
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderDuration')}
        </DataTable.SortableHeader>
      ),
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
        const job = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="jobs-action-trigger"
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
                data-testid="job-action-manage-button"
                variant="primary"
                onClick={() => navigate(`./${row.original.id}`)}
              >
                {t('tableActionManage')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="job-action-restart-button"
                variant="primary"
                onClick={() => {
                  onRestartClicked(row.original);
                }}
              >
                {t('tableActionRestart')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="job-action-stop-button"
                disabled={!isRunningJob(job.status.state)}
                variant="primary"
                onClick={() => {
                  onStopClicked(row.original);
                }}
              >
                {t('tableActionStop')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="job-action-delete-button"
                variant="destructive"
                disabled={!isStoppedJob(job.status.state)}
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
