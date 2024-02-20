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
import AppsStatusBadge from './appsStatusBadge';
import ResourcesDeployedColumn from './resourcesDeployedCol';

interface AppsListColumnsProps {
  onDeleteClicked: (app: ai.app.App) => void;
  onStopClicked: (app: ai.app.App) => void;
  onStartClicked: (app: ai.app.App) => void;
}
export const getColumns = ({
  onDeleteClicked,
  onStopClicked,
  onStartClicked,
}: AppsListColumnsProps) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const navigate = useNavigate();
  const columns: ColumnDef<ai.app.App>[] = [
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
      id: 'Image',
      accessorFn: (row) => row.spec.image,
      header: ({ column }) => (
        <SortableHeader column={column}>Image</SortableHeader>
      ),
    },
    {
      id: 'Region',
      accessorFn: (row) => row.spec.region,
      header: ({ column }) => (
        <SortableHeader column={column}>Region</SortableHeader>
      ),
    },
    {
      id: 'Resources',
      accessorFn: (row) => row.spec.resources.cpu,
      header: ({ column }) => (
        <SortableHeader column={column}>Resources deployed</SortableHeader>
      ),
      cell: ({ row }) => {
        return <ResourcesDeployedColumn app = { row.original } />;
      },
    },
    {
      id: 'CreationDate',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <SortableHeader column={column}>Creation Date</SortableHeader>
      ),
    },
    {
      id: 'UpdateDate',
      accessorFn: (row) => row.updatedAt,
      header: ({ column }) => (
        <SortableHeader column={column}>Last updated</SortableHeader>
      ),
    },
    {
      id: 'Status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <SortableHeader column={column}>Status</SortableHeader>
      ),
      cell: ({ row }) => {
        return <AppsStatusBadge status={row.original.status} />;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const app = row.original;
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
                  navigate(`/projects/${projectId}/apps/${app.id}`)
                }
              >
                Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  row.original.status.state !== ai.app.AppStateEnum.STOPPED
                }
                onClick={() => {
                  onStartClicked(row.original);
                }}
              >
                Start
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  row.original.status.state !== ai.app.AppStateEnum.RUNNING
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
