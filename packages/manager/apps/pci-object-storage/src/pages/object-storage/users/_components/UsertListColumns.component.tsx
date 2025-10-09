import { ColumnDef } from '@tanstack/react-table';
import { HelpCircle, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import user from '@/types/User';
import { useGetUserAccess } from './useGetUserAccess.hook';

interface UsersListColumnsProps {
  onEnableUserClicked: (user: user.User) => void;
  onImportUserAccessClicked: (user: user.User) => void;
  onDownloadUserAccessClicked: (user: user.User) => void;
  onDownloadRcloneClicked: (user: user.User) => void;
  onSecretKeyClicked: (user: user.User) => void;
  onDeleteClicked: (user: user.User) => void;
}
export const getColumns = ({
  onEnableUserClicked,
  onImportUserAccessClicked,
  onDownloadUserAccessClicked,
  onDownloadRcloneClicked,
  onSecretKeyClicked,
  onDeleteClicked,
}: UsersListColumnsProps) => {
  const { t } = useTranslation('pci-object-storage/users');
  const columns: ColumnDef<user.User>[] = [
    {
      id: 'name',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.username,
    },
    {
      id: 'description',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderDescription')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.description,
    },
    {
      id: 'access key',
      header: () => t('tableHeaderAccessKey'),
      cell: ({ row }) => {
        const accessQuery = useGetUserAccess(row.original.id);
        if (accessQuery.isPending) return <Skeleton className="h-4 w-32" />;
        return accessQuery.access;
      },
    },
    {
      id: 's3 activated',
      header: () => (
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger>
              <HelpCircle className="mr-2 size-4" />
            </PopoverTrigger>
            <PopoverContent className="text-sm">
              <p>{t('s3InfoHelper')}</p>
            </PopoverContent>
          </Popover>
          {t('tableHeaderS3Enabler')}
        </div>
      ),
      cell: ({ row }) => {
        const accessQuery = useGetUserAccess(row.original.id);
        if (accessQuery.isPending) return <Skeleton className="h-4 w-32" />;
        return (
          <div className="flex items-center gap-2">
            {accessQuery.access ? (
              <Badge variant="success">{t('tableS3Enable')}</Badge>
            ) : (
              <>
                <Badge variant="warning">{t('tableS3Disable')}</Badge>
              </>
            )}
          </div>
        );
      },
    },
    {
      id: MENU_COLUMN_ID,
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const accessQuery = useGetUserAccess(row.original.id);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="users-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent data-testid="users-action-content" align="end">
              {accessQuery.isPending ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <DropdownMenuItem
                  variant="primary"
                  onClick={() => {
                    onEnableUserClicked(row.original);
                  }}
                  disabled={!!accessQuery.access}
                >
                  {t('tableActionEnable')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                variant="primary"
                onClick={() => {
                  onImportUserAccessClicked(row.original);
                }}
              >
                {t('tableActionImportUserAccess')}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="primary"
                onClick={() => {
                  onDownloadUserAccessClicked(row.original);
                }}
              >
                {t('tableActionDowloadUserAccess')}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="primary"
                onClick={() => {
                  onDownloadRcloneClicked(row.original);
                }}
              >
                {t('tableActionDowloadRclone')}
              </DropdownMenuItem>
              {accessQuery.isPending ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <DropdownMenuItem
                  variant="primary"
                  onClick={() => {
                    onSecretKeyClicked(row.original);
                  }}
                  disabled={!accessQuery.access}
                >
                  {t('tableActionShowSecretKey')}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {accessQuery.isPending ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <DropdownMenuItem
                  data-testid="user-action-delete-button"
                  variant="destructive"
                  onClick={() => {
                    onDeleteClicked(row.original);
                  }}
                  disabled={!accessQuery.access}
                >
                  {t('tableActionDisable')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
