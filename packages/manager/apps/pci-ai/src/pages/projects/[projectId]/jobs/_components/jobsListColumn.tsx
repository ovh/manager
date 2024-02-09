import { useRequiredParams } from '@/hooks/useRequiredParams';
import { ColumnDef } from '@tanstack/react-table';
import { Link, useNavigate } from 'react-router-dom';

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
import { MoreHorizontal } from 'lucide-react';

import { ai } from '@/models/types';
import JobsStatusBadge from './jobsStatusBadge';

interface JobsListColumnsProps {
  onDeleteClicked: (job: ai.job.Job) => void;
  onStopClicked: (job: ai.job.Job) => void;
  onStartClicked: (job: ai.job.Job) => void;
}
export const getColumns = ({
  onDeleteClicked,
  onStopClicked,
  onStartClicked,
}: JobsListColumnsProps) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const navigate = useNavigate();
  const columns: ColumnDef<ai.job.Job>[] = [
    {
      id: 'name/id',
      header: ({ column }) => (
        <SortableHeader column={column}>Name / ID</SortableHeader>
      ),
      accessorFn: (row) => row.id,
      cell: ({ row }) => {
        const { id } = row.original;
        const notename = row.original.spec.name;
        return (
          <div className="flex flex-col flex-nowrap text-left">
            <Button
              asChild
              variant="link"
              className="justify-normal px-0 h-auto leading-4 font-semibold"
            >
              <Link to={id}>{notename}</Link>
            </Button>
            <span className="text-sm whitespace-nowrap">{id}</span>
          </div>
        );
      },
    },
    {
      id: 'Region',
      accessorFn: (row) => row.spec.region,
      header: ({ column }) => (
        <SortableHeader column={column}>Region</SortableHeader>
      ),
    },
    {
      id: 'Docker',
      accessorFn: (row) => row.spec.image,
      header: ({ column }) => (
        <SortableHeader column={column}>Docker Image</SortableHeader>
      ),
    },
    {
      id: 'User',
      accessorFn: (row) => row.user,
      header: ({ column }) => (
        <SortableHeader column={column}>User</SortableHeader>
      ),
    },
    {
      id: 'Status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <SortableHeader column={column}>Status</SortableHeader>
      ),
      cell: ({ row }) => {
        return <JobsStatusBadge status={row.original.status} />;
      },
    },
    {
      id: 'CreationDate',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <SortableHeader column={column}>Creation</SortableHeader>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const job = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/projects/${projectId}/jobs/${job.id}`)
                }
              >
                Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  row.original.status.state !== ai.job.JobStateEnum.ERROR
                }
                onClick={() => {
                  onStartClicked(row.original);
                }}
              >
                Relaunch
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  row.original.status.state !== ai.job.JobStateEnum.RUNNING
                }
                onClick={() => {
                  onStopClicked(row.original);
                }}
              >
                Stop
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  onDeleteClicked(row.original);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
