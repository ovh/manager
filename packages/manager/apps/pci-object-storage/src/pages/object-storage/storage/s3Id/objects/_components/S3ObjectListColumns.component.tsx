import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useNavigate } from 'react-router-dom';
import { VersioningStatusEnum } from '@datatr-ux/ovhcloud-types/cloud/storage/VersioningStatusEnum';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import { octetConverter } from '@/lib/bytesHelper';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import Link from '@/components/links/Link.component';
import FileIcon from '@/components/fileIcon/FileIcon.component';
import { useS3Data } from '../../S3.context';

interface ObjectListColumnsProps {
  onDownloadClicked: (object: StorageObject) => void;
  onDeleteClicked: (object: StorageObject) => void;
  isPending: boolean;
}
export const getColumns = ({
  isPending,
  onDownloadClicked,
  onDeleteClicked,
}: ObjectListColumnsProps) => {
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );
  const navigate = useNavigate();
  const columns: ColumnDef<StorageObject>[] = [
    {
      id: 'name',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.key,
      cell: ({ row }) => (
        <div>
          <div className="flex gap-1 items-center">
            <FileIcon
              fileName={row.original.key}
              className="w-4 h-4 text-muted-foreground"
            />
            <Link
              to={`./object?objectKey=${encodeURIComponent(row.original.key)}`}
            >
              {row.original.key}
            </Link>
          </div>
          {row.original.isDeleteMarker && (
            <Badge className="ml-2" variant="info">
              {t('tableSuppressionBadgeLabel')}
            </Badge>
          )}
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
        <FormattedDate
          options={{
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }}
          date={new Date(row.original.lastModified)}
        />
      ),
    },
    {
      id: 'storageClass',
      accessorFn: (row) => row.storageClass,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderStorageClass')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <span>
          {!row.original.isDeleteMarker &&
            tObj(`objectClass_${row.original.storageClass}`)}
        </span>
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
                onClick={() =>
                  navigate(
                    `./object?objectKey=${encodeURIComponent(object.key)}`,
                  )
                }
              >
                {t('tableActionManage')}
              </DropdownMenuItem>
              {!object.isDeleteMarker && (
                <DropdownMenuItem
                  variant="primary"
                  disabled={isPending}
                  onClick={() => onDownloadClicked(object)}
                >
                  {t('tableActionDownload')}
                </DropdownMenuItem>
              )}
              {s3.versioning.status === VersioningStatusEnum.enabled && (
                <DropdownMenuItem
                  variant="primary"
                  disabled={isPending}
                  onClick={() =>
                    navigate(
                      `./object/versions?objectKey=${encodeURIComponent(
                        object.key,
                      )}`,
                    )
                  }
                >
                  {t('tableActionShowVersion')}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={!!object.isDeleteMarker}
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
