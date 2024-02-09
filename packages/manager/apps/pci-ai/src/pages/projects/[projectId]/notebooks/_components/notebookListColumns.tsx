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
import { formattedDuration } from '@/data/constant';
import NotebookStatusBadge from './notebookStatusBadge';


interface NotebookListColumnsProps {
  onDeleteClicked: (notebook: ai.notebook.Notebook) => void;
  onStopClicked: (notebook: ai.notebook.Notebook) => void;
  onStartClicked: (notebook: ai.notebook.Notebook) => void;
}
export const getColumns = ({ onDeleteClicked, onStopClicked, onStartClicked }: NotebookListColumnsProps) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const navigate = useNavigate();
  const columns: ColumnDef<ai.notebook.Notebook>[] = [
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
      id: 'Environnement',
      accessorFn: (row) => row.spec.env.frameworkVersion,
      header: ({ column }) => (
        <SortableHeader column={column}>Environnement</SortableHeader>
      ),
    },
    {
      id: 'CPU',
      accessorFn: (row) => row.spec.resources.cpu,
      header: ({ column }) => (
        <SortableHeader column={column}>CPU</SortableHeader>
      ),
    },
    {
      id: 'GPU',
      accessorFn: (row) => (row.spec.resources.gpu > 0) ? row.spec.resources.gpu  : 'none',
      header: ({ column }) => (
        <SortableHeader column={column}>GPU</SortableHeader>
      ),
    },
    {
      id: 'Privacy',
      accessorFn: (row) => row.spec.unsecureHttp,
      header: ({ column }) => (
        <SortableHeader column={column}>Privacy</SortableHeader>
      ),
      cell: ({ row }) => {
        const isPublic = row.original.spec.unsecureHttp;
        return isPublic ? `Public` : `Private`;
      },
    },
    {
      id: 'Operating Time',
      accessorFn: (row) => formattedDuration(row.status.duration || 0, true),
      header: ({ column }) => (
        <SortableHeader column={column}>Operating Time</SortableHeader>
      ),
    },
    {
      id: 'Access',
      accessorFn: (row) => row.spec.env.editorId,
      header: ({ column }) => (
        <SortableHeader column={column}>Operating Time</SortableHeader>
      ),
    },
    {
      id: 'Status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <SortableHeader column={column}>Status</SortableHeader>
      ),
      cell: ({ row }) => {
        return <NotebookStatusBadge status={row.original.status} />;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const notebook = row.original;
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
                onClick={() => navigate(`/projects/${projectId}/notebooks/${notebook.id}`)}
              >
                Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={row.original.status.state !== ai.notebook.NotebookStateEnum.STOPPED}
                onClick={() => {
                  onStartClicked(row.original);
                }}
              >
                Start
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={row.original.status.state !== ai.notebook.NotebookStateEnum.RUNNING}
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
