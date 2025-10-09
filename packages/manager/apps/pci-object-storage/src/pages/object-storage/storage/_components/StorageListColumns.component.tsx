import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useToast,
} from '@datatr-ux/uxlib';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud/index';
import DataTable from '@/components/data-table';
import Link from '@/components/links/Link.component';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import { getRegionFlag } from '@/lib/flagHelper';
import Flag from '@/components/flag/Flag.component';
import storages, {
  FormattedStorage,
  ObjectStorageTypeEnum,
} from '@/types/Storages';
import { octetConverter } from '@/lib/bytesHelper';
import {
  getMacroRegion,
  useTranslatedMicroRegions,
} from '@/hooks/useTranslatedMicroRegions';

interface StoragesListColumnsProps {
  onSwitchClicked: (storage: FormattedStorage) => void;
  onAddUserClicked: (storage: FormattedStorage) => void;
  onDeleteClicked: (storage: FormattedStorage) => void;
}
export const getColumns = ({
  onSwitchClicked,
  onDeleteClicked,
  onAddUserClicked,
}: StoragesListColumnsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('pci-object-storage/storages');
  const { t: tRegions } = useTranslation('regions');
  const toast = useToast();
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
        const { translateMacroRegion } = useTranslatedMicroRegions();
        return (
          <div className="flex items-center gap-2">
            <Flag
              flagName={getRegionFlag(getMacroRegion(row.original.region))}
              className="w-4 h-3"
            />
            <span className="whitespace-nowrap">
              {translateMacroRegion(row.original.region)}
            </span>
          </div>
        );
      },
    },
    {
      id: 'Mode',
      accessorFn: (row) => row.regionType,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderDeploymentMode')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <div>
          {row.original.regionType === RegionTypeEnum['region-3-az'] ? (
            <Badge className="bg-primary-500">
              <span className="text-white">3-AZ</span>
            </Badge>
          ) : (
            <Badge className="bg-primary-400">
              <span className="text-white">1-AZ</span>
            </Badge>
          )}
        </div>
      ),
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
      accessorFn: (row) => row.objectsCount || row.storedObjects,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderObjectNumber')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <span>
          {row.original?.storageType === ObjectStorageTypeEnum.s3
            ? row.original.objectsCount
            : row.original.storedObjects}
        </span>
      ),
    },
    {
      id: 'Space',
      accessorFn: (row) => row.objectsSize,
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
                ? octetConverter(row.original?.objectsSize, false, 2)
                : '-'}
            </span>
          )}
          {row.original?.storageType === ObjectStorageTypeEnum.swift && (
            <span>
              {row.original?.storedBytes
                ? octetConverter(row.original?.storedBytes, false, 2)
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
              <DropdownMenuItem
                variant="primary"
                onClick={() => {
                  navigator.clipboard.writeText(storage.id);
                  toast.toast({
                    description: 'storage id saved in clipboard',
                  });
                }}
              >
                {t('tableActionCopy')}
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
              {storage.storageType === ObjectStorageTypeEnum.s3 && (
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
                variant="destructive"
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
