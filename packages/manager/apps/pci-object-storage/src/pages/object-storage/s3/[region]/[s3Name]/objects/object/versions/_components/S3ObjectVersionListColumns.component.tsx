import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import FileIcon from '@/components/file-icon/FileIcon.component';
import { isDeepArchive } from '@/lib/s3ObjectHelper';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';
import {
  useObjectSelection,
  SelectedObject,
} from '../../../_contexts/ObjectSelection.context';

interface ObjectVersionListColumnsProps {
  onDownloadClicked: (object: StorageObject) => void;
  onDeleteClicked: (object: StorageObject) => void;
  isPending: boolean;
}

const SelectCheckboxCell = ({ object }: { object: StorageObject }) => {
  const { isSelected, setSelection } = useObjectSelection();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');

  return (
    <Checkbox
      checked={isSelected(object.key, object.versionId)}
      onCheckedChange={(checked: boolean) =>
        setSelection({
          key: object.key,
          versionId: object.versionId,
          checked,
        })
      }
      aria-label={t('selectObject', { name: object.key })}
    />
  );
};

const SelectAllHeader = ({ objects }: { objects: StorageObject[] }) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const {
    selectAll,
    clearSelection,
    getSelectedObjects,
  } = useObjectSelection();

  const selectedObjects = getSelectedObjects();
  const allSelected =
    objects.length > 0 &&
    objects.every((obj) =>
      selectedObjects.some(
        (s: SelectedObject) =>
          s.key === obj.key && s.versionId === obj.versionId,
      ),
    );
  const someSelected =
    !allSelected &&
    objects.some((obj) =>
      selectedObjects.some(
        (s: SelectedObject) =>
          s.key === obj.key && s.versionId === obj.versionId,
      ),
    );

  const getCheckedState = (): boolean | 'indeterminate' => {
    if (allSelected) return true;
    if (someSelected) return 'indeterminate';
    return false;
  };

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAll(
        objects.map((obj) => ({ key: obj.key, versionId: obj.versionId })),
      );
    }
  };

  return (
    <Checkbox
      checked={getCheckedState()}
      onCheckedChange={handleSelectAll}
      aria-label={t('selectAll')}
    />
  );
};

export const getColumns = ({
  isPending,
  onDownloadClicked,
  onDeleteClicked,
  objects,
}: ObjectVersionListColumnsProps & { objects: StorageObject[] }) => {
  const localeBytesConverter = useLocaleBytesConverter();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );
  const columns: ColumnDef<StorageObject>[] = [
    {
      id: 'select',
      header: () => <SelectAllHeader objects={objects} />,
      cell: ({ row }) => <SelectCheckboxCell object={row.original} />,
      enableSorting: false,
      enableGlobalFilter: false,
    },
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
            {row.original.key}
          </div>
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
        <Badge variant="outline">
          {!row.original.isDeleteMarker
            ? tObj(`objectClass_${row.original.storageClass}`)
            : '-'}
        </Badge>
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
      cell: ({ row }) => <span>{localeBytesConverter(row.original.size)}</span>,
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
                disabled={isPending || isDeepArchive(object)}
                onClick={() => onDownloadClicked(object)}
              >
                {t('tableActionDownload')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="critical"
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
