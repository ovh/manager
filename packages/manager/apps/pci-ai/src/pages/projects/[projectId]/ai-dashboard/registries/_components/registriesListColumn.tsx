import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortableHeader } from '@/components/ui/data-table';
import { CircleEllipsis } from 'lucide-react';

import { ai } from '@/models/types';

interface RegistiresListColumnsProps {
  onDeleteClicked: (token: ai.registry.Registry) => void;
}
export const getRegistriesColumns = ({
  onDeleteClicked,
}: RegistiresListColumnsProps) => {
  const columns: ColumnDef<ai.registry.Registry>[] = [
    {
      id: 'Id',
      accessorFn: (row) => row.id,
      header: ({ column }) => (
        <SortableHeader column={column}>ID</SortableHeader>
      ),
    },
    {
      id: 'Region',
      accessorFn: (row) => row.region,
      header: ({ column }) => (
        <SortableHeader column={column}>Region</SortableHeader>
      ),
    },
    {
      id: 'URL',
      accessorFn: (row) => row.url,
      header: ({ column }) => (
        <SortableHeader column={column}>URL</SortableHeader>
      ),
    },
    {
      id: 'Username',
      accessorFn: (row) => row.username,
      header: ({ column }) => (
        <SortableHeader column={column}>Username</SortableHeader>
      ),
    },
    {
        id: 'user',
        accessorFn: (row) => row.user,
        header: ({ column }) => (
          <SortableHeader column={column}>Added by</SortableHeader>
        ),
      },
    {
      id: 'CreationDate',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <SortableHeader column={column}>Creation Date</SortableHeader>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <CircleEllipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
