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
} from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import { UserWithS3Credentials } from '@/data/hooks/user/useGetUsersWithS3Credentials.hook';

interface UsersListColumnsProps {
  onEnableUserClicked: (user: UserWithS3Credentials) => void;
  onImportUserAccessClicked: (user: UserWithS3Credentials) => void;
  onDownloadUserAccessClicked: (user: UserWithS3Credentials) => void;
  onDownloadRcloneClicked: (user: UserWithS3Credentials) => void;
  onSecretKeyClicked: (user: UserWithS3Credentials) => void;
  onDeleteClicked: (user: UserWithS3Credentials) => void;
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
      id: 's3 activated',
      header: ({ column }) => (
        <>
          <Popover>
            <PopoverTrigger>
              <HelpCircle className="mr-2 size-4" />
            </PopoverTrigger>
            <PopoverContent className="text-sm">
              <p>{t('s3InfoHelper')}</p>
            </PopoverContent>
          </Popover>
          <DataTable.SortableHeader column={column}>
            {t('tableHeaderS3Enabler')}
          </DataTable.SortableHeader>
        </>
      ),
      accessorFn: (row) => row.access_key,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.access_key ? (
            <Badge variant="success">{t('tableS3Enable')}</Badge>
          ) : (
            <>
              <Badge variant="warning">{t('tableS3Disable')}</Badge>
            </>
          )}
        </div>
      ),
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
                  onEnableUserClicked(row.original);
                }}
                disabled={!!row.original.access_key}
              >
                {t('tableActionEnable')}
              </DropdownMenuItem>
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
                {t('tableActionDisable')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
