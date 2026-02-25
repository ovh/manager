import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import Link from '@/components/links/Link.component';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import storages, {
  FormattedStorage,
  ObjectStorageTypeEnum,
} from '@/types/Storages';
import { RegionTypeBadge } from '@/components/region-type-badge/RegionTypeBadge.component';
import RegionWithFlag from '@/components/region-with-flag/RegionWithFlag.component';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';

interface StoragesListColumnsProps {
  onSwitchClicked: (storage: FormattedStorage) => void;
  onAddUserClicked: (storage: FormattedStorage) => void;
  onDeleteClicked: (storage: FormattedStorage) => void;
}
export const useGetColumns = ({
  onSwitchClicked,
  onDeleteClicked,
  onAddUserClicked,
}: StoragesListColumnsProps) => {
  const navigate = useNavigate();
  const localeBytesConverter = useLocaleBytesConverter();
  const { t } = useTranslation('pci-object-storage/storages');
  const columns: ColumnDef<FormattedStorage>[] = [
    {
      id: 'name',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => `${row.name}-${row.id}`,
      cell: ({ row }) => {
        const { id, name } = row.original;
        return (
          <div className="flex flex-col flex-nowrap text-left">
            <Link
              to={
                row.original.storageType === ObjectStorageTypeEnum.s3
                  ? `./s3/${row.original.region}/${row.original.name}/objects`
                  : `./swift/${id}`
              }
            >
              {name}
            </Link>
          </div>
        );
      },
    },
    {
      id: 'Region',
      accessorFn: (row) => row.region,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderLocation')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        return <RegionWithFlag region={row.original.regionObj} />;
      },
    },
    {
      id: 'Mode',
      accessorFn: (row) => row.regionObj.type,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderDeploymentMode')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => <RegionTypeBadge type={row.original.regionObj.type} />,
    },
    {
      id: 'Offre',
      accessorFn: (row) => row.storageType,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderOffer')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <span>
          {row.original?.storageType === ObjectStorageTypeEnum.s3
            ? t('tableS3Offer')
            : t('tableSwiftOffer')}
        </span>
      ),
    },
    {
      id: 'Objects',
      accessorFn: (row) =>
        row.storageType === ObjectStorageTypeEnum.s3
          ? row.objectsCount
          : row.storedObjects,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderObjectNumber')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        const objectNumber =
          row.original?.storageType === ObjectStorageTypeEnum.s3
            ? row.original.objectsCount
            : row.original.storedObjects;
        const objectNumberToDisplay =
          objectNumber && objectNumber > 0 ? objectNumber : '-';
        return <span>{objectNumberToDisplay}</span>;
      },
    },
    {
      id: 'Space',
      accessorFn: (row) =>
        row.storageType === ObjectStorageTypeEnum.s3
          ? row.objectsSize
          : row.storedBytes,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderSpaceUsed')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <>
          {row.original?.storageType === ObjectStorageTypeEnum.s3 && (
            <span>
              {row.original?.objectsSize
                ? localeBytesConverter(row.original?.objectsSize, false, 2)
                : '-'}
            </span>
          )}
          {row.original?.storageType === ObjectStorageTypeEnum.swift && (
            <span>
              {row.original?.storedBytes
                ? localeBytesConverter(row.original?.storedBytes, false, 2)
                : '-'}
            </span>
          )}
        </>
      ),
    },
    {
      id: 'Type',
      accessorFn: (row) => row.containerType,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderType')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        let label: string;
        switch (row.original.containerType) {
          case storages.TypeEnum.private:
            label = t('tablePrivateType');
            break;
          case storages.TypeEnum.public:
            label = t('tablePublicType');
            break;
          case storages.TypeEnum.static:
            label = t('tableStaticType');
            break;
          default:
            label = '';
        }
        return <span>{label}</span>;
      },
    },
    {
      id: MENU_COLUMN_ID,
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const storage = row.original;

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
                data-testid="storage-action-manage-button"
                variant="primary"
                onClick={() =>
                  navigate(
                    storage.storageType === ObjectStorageTypeEnum.s3
                      ? `./s3/${storage.region}/${storage.name}`
                      : `./swift/${storage.id}`,
                  )
                }
              >
                {t('tableActionManage')}
              </DropdownMenuItem>
              {storage.storageType === ObjectStorageTypeEnum.swift && (
                <DropdownMenuItem
                  data-testid="storage-action-switch-button"
                  variant="primary"
                  onClick={() => onSwitchClicked(row.original)}
                >
                  {row.original.public
                    ? t('tableActionSwitchToPrivate')
                    : t('tableActionSwitchToPublic')}
                </DropdownMenuItem>
              )}
              {storage.storageType === ObjectStorageTypeEnum.s3 &&
                storage.regionObj.type !== RegionTypeEnum.localzone && (
                  <DropdownMenuItem
                    variant="primary"
                    data-testid="storage-action-add-user-button"
                    onClick={() => onAddUserClicked(row.original)}
                  >
                    {t('tableActionAddUser')}
                  </DropdownMenuItem>
                )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="storage-action-delete-button"
                variant="critical"
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
