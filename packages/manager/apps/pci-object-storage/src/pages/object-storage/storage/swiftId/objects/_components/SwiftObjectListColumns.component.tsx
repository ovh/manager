import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import storages from '@/types/Storages';
import { octetConverter } from '@/lib/bytesHelper';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import FileIcon from '@/components/fileIcon/FileIcon.component';

interface ObjectListColumnsProps {
  onDownloadClicked: (object: storages.ContainerObject) => void;
  onDeleteClicked: (object: storages.ContainerObject) => void;
  isPending: boolean;
}
export const getColumns = ({
  isPending,
  onDownloadClicked,
  onDeleteClicked,
}: ObjectListColumnsProps) => {
  const { t } = useTranslation('pci-object-storage/storages/swift/objects');
  const columns: ColumnDef<storages.ContainerObject>[] = [
    {
      id: 'name',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.name,
      cell: ({ row }) => (
        <div className="flex gap-1 items-center">
          <FileIcon
            fileName={row.original.name}
            className="w-4 h-4 text-muted-foreground"
          />
          {row.original.name}
        </div>
      ),
    },
    {
      id: 'updateDate',
      accessorFn: (row) => row.lastModified,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderUpdateDate')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <FormattedDate date={new Date(row.original.lastModified)} />
      ),
    },
    {
      id: 'size',
      accessorFn: (row) => row.size,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderSize')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => <span>{octetConverter(row.original.size)}</span>,
    },
    {
      id: 'type',
      accessorFn: (row) => row.contentType,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderType')}
        </DataTable.SortableHeader>
      ),
    },
    {
      id: MENU_COLUMN_ID,
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const object = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="storages-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="storages-action-content"
              align="end"
            >
              <DropdownMenuItem
                variant="primary"
                disabled={isPending}
                onClick={() => onDownloadClicked(object)}
              >
                {t('tableActionDownload')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  onDeleteClicked(object);
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
