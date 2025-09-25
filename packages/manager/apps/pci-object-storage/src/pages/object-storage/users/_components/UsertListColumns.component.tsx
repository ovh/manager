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
import user from '@/types/User';
import { UserWithS3Credentials } from '@/data/hooks/user/useGetUsersWithS3Credentials.hook';

interface UsersListColumnsProps {
  onImportUserAccessClicked: (user: user.User) => void;
  onDownloadUserAccessClicked: (user: user.User) => void;
  onDownloadRcloneClicked: (user: user.User) => void;
  onSecretKeyClicked: (user: user.User) => void;
  onDeleteClicked: (user: user.User) => void;
}
export const getColumns = ({
  onImportUserAccessClicked,
  onDownloadUserAccessClicked,
  onDownloadRcloneClicked,
  onSecretKeyClicked,
  onDeleteClicked,
}: UsersListColumnsProps) => {
  const { t } = useTranslation('pci-object-storage/users');
  const columns: ColumnDef<UserWithS3Credentials>[] = [
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
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderAccessKey')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.access_key,
    },
    {
      id: MENU_COLUMN_ID,
      enableGlobalFilter: false,
      cell: ({ row }) => {
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
              <DropdownMenuItem
                variant="primary"
                onClick={() => {
                  onSecretKeyClicked(row.original);
                }}
              >
                {t('tableActionShowSecretKey')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="user-action-delete-button"
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
