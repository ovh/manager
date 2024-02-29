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
import { DataStoreWithRegion } from '@/hooks/api/ai/useGetDatastores';

interface DatastoresListColumnsProps {
  onDeleteClicked: (datastore: DataStoreWithRegion) => void;
}
export const getDatastoresColumns = ({
  onDeleteClicked,
}: DatastoresListColumnsProps) => {
  const columns: ColumnDef<DataStoreWithRegion>[] = [
    {
      id: 'Alias',
      accessorFn: (row) => row.alias,
      header: ({ column }) => (
        <SortableHeader column={column}>Alias</SortableHeader>
      ),
    },
    {
      id: 'Container',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <SortableHeader column={column}>Type de container</SortableHeader>
      ),
    },
    {
      id: 'Owner',
      accessorFn: (row) => row.owner,
      header: ({ column }) => (
        <SortableHeader column={column}>Owner</SortableHeader>
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
