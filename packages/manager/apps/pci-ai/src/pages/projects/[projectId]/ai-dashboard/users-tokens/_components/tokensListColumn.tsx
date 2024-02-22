import { ColumnDef } from '@tanstack/react-table';

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
import { formattedTokenRole } from '@/data/constant';

interface TokensListColumnsProps {
  onRegenerateClicked: (token: ai.token.Token) => void;
  onDeleteClicked: (token: ai.token.Token) => void;
}
export const getTokensColumns = ({
  onRegenerateClicked,
  onDeleteClicked,
}: TokensListColumnsProps) => {
  const columns: ColumnDef<ai.token.Token>[] = [
    {
      id: 'Name',
      accessorFn: (row) => row.spec.name,
      header: ({ column }) => (
        <SortableHeader column={column}>Name</SortableHeader>
      ),
    },
    {
      id: 'Label',
      accessorFn: (row) => row.spec.labelSelector,
      header: ({ column }) => (
        <SortableHeader column={column}>Label Selector</SortableHeader>
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
      id: 'Role',
      accessorFn: (row) => formattedTokenRole(row.spec.role),
      header: ({ column }) => (
        <SortableHeader column={column}>Role</SortableHeader>
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
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  onRegenerateClicked(row.original);
                }}
              >
                Regenerate
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
