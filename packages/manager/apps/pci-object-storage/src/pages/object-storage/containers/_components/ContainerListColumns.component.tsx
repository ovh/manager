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
import DataTable from '@/components/data-table';
import Link from '@/components/links/Link.component';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import { getRegionFlag } from '@/lib/flagHelper';
import Flag from '@/components/flag/Flag.component';
import storages, { Containers } from '@/types/Storages';
import { octetConverter } from '@/lib/bytesHelper';

interface ContainersListColumnsProps {
  onSwitchClicked: (container: Containers) => void;
  onDeleteClicked: (container: Containers) => void;
}
export const getColumns = ({
  onSwitchClicked,
  onDeleteClicked,
}: ContainersListColumnsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('pci-object-storage/containers');
  const { t: tRegions } = useTranslation('regions');
  const toast = useToast();
  const columns: ColumnDef<Containers>[] = [
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
            <Link to={id}>{name}</Link>
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Flag
            flagName={getRegionFlag(row.original.region)}
            className="w-4 h-3"
          />
          <span className="whitespace-nowrap">
            {tRegions(`region_${row.original.region}`)}
          </span>
        </div>
      ),
    },
    {
      id: 'Mode',
      accessorFn: (row) => row.containerType,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderDeploymentMode')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <div>
          {row.original.region === 'EU-WEST-PAR' ? (
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
      accessorFn: (row) => row?.s3StorageType,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderOffer')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <span>
          {row.original?.s3StorageType
            ? t('tableS3Offer')
            : t('tableSwiftOffer')}
        </span>
      ),
    },
    {
      id: 'Objects',
      accessorFn: (row) => row.objectsCount || 0,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderObjectNumber')}
        </DataTable.SortableHeader>
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
        <span>
          {row.original?.objectsSize
            ? octetConverter(row.original?.objectsSize, false, 2)
            : '-'}
        </span>
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
        const container = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="containers-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="containers-action-content"
              align="end"
            >
              <DropdownMenuItem
                variant="primary"
                onClick={() => navigate(`./${row.original.id}`)}
              >
                {t('tableActionManage')}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="primary"
                onClick={() => {
                  navigator.clipboard.writeText(container.id);
                  toast.toast({
                    description: 'container id saved in clipboard',
                  });
                }}
              >
                {t('tableActionCopy')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="container-action-rename-button"
                variant="primary"
                onClick={() => {
                  onSwitchClicked(row.original);
                }}
              >
                {row.original.public
                  ? t('tableActionSwitchToPrivate')
                  : t('tableActionSwitchToPublic')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="container-action-delete-button"
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
