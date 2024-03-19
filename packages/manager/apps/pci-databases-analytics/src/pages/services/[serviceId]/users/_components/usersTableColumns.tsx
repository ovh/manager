import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import FormattedDate from '@/components/table-date';
import { GenericUser } from '@/api/databases/users';
import { SortableHeader } from '@/components/ui/data-table';
import UserStatusBadge from './userStatusBadge';
import UserActions from './usersTableActions';

interface UserListColumnsProps {
  displayGroupCol: boolean;
  displayRolesCol: boolean;
  displayKeysCols: boolean;
  displayCategoriesCol: boolean;
  displayCommandsCol: boolean;
  displayChannelsCol: boolean;
  onDeleteClicked: (user: GenericUser) => void;
  onResetPasswordClicked: (user: GenericUser) => void;
  onEditClicked: (user: GenericUser) => void;
}

export const getColumns = ({
  displayGroupCol = false,
  displayRolesCol = false,
  displayKeysCols = false,
  displayCategoriesCol = false,
  displayCommandsCol = false,
  displayChannelsCol = false,
  onDeleteClicked,
  onResetPasswordClicked,
  onEditClicked,
}: UserListColumnsProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const userNameColumn: ColumnDef<GenericUser> = {
    id: 'username',
    header: ({ column }) => (
      <SortableHeader column={column}>{t('tableHeadName')}</SortableHeader>
    ),
    accessorFn: (row) => row.username,
  };
  const groupColumn: ColumnDef<GenericUser> = {
    id: 'group',
    header: ({ column }) => (
      <SortableHeader column={column}>{t('tableHeadGroup')}</SortableHeader>
    ),
    accessorFn: (row) => ('group' in row ? row.group : ''),
  };
  const rolesColumn: ColumnDef<GenericUser> = {
    id: 'roles',
    header: t('tableHeadRoles'),
    cell: ({ row }) => {
      const user = row.original;
      const roles: string[] = 'roles' in user ? user.roles : [];
      return (
        <div className="flex flex-col gap-1">
          {roles.map((role) => (
            <Badge variant={'default'} key={role} className="text-xs w-fit">
              {role}
            </Badge>
          ))}
        </div>
      );
    },
    accessorFn: (row) => ('roles' in row ? row.roles : ''),
  };
  const keysColumn: ColumnDef<GenericUser> = {
    id: 'keys',
    header: ({ column }) => (
      <SortableHeader column={column}>{t('tableHeadKeys')}</SortableHeader>
    ),
    accessorFn: (row) => ('keys' in row ? row.keys.length : ''),
  };
  const categoriesColumn: ColumnDef<GenericUser> = {
    id: 'categories',
    header: ({ column }) => (
      <SortableHeader column={column}>
        {t('tableHeadCategories')}
      </SortableHeader>
    ),
    accessorFn: (row) => ('categories' in row ? row.categories.length : ''),
  };
  const commandsColumn: ColumnDef<GenericUser> = {
    id: 'commands',
    header: ({ column }) => (
      <SortableHeader column={column}>{t('tableHeadCommands')}</SortableHeader>
    ),
    accessorFn: (row) => ('commands' in row ? row.commands.length : ''),
  };
  const channelsColumn: ColumnDef<GenericUser> = {
    id: 'channels',
    header: ({ column }) => (
      <SortableHeader column={column}>{t('tableHeadChannels')}</SortableHeader>
    ),
    accessorFn: (row) => ('channels' in row ? row.channels.length : ''),
  };
  const creationDateColumn: ColumnDef<GenericUser> = {
    id: 'Creation date',
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <SortableHeader column={column}>
        {t('tableHeadCreationDate')}
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <FormattedDate date={new Date(row.original.createdAt)} />
    ),
  };
  const statusColumn: ColumnDef<GenericUser> = {
    id: 'Status',
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <SortableHeader column={column}>{t('tableHeadStatus')}</SortableHeader>
    ),
    cell: ({ row }) => {
      return <UserStatusBadge status={row.original.status} />;
    },
  };
  const actionsColumn: ColumnDef<GenericUser> = {
    id: 'actions',
    cell: ({ row }) => (
      <UserActions
        user={row.original}
        onDeleteClicked={onDeleteClicked}
        onResetPasswordClicked={onResetPasswordClicked}
        onEditClicked={onEditClicked}
      />
    ),
  };
  return [
    userNameColumn,
    ...(displayGroupCol ? [groupColumn] : []),
    ...(displayRolesCol ? [rolesColumn] : []),
    ...(displayKeysCols ? [keysColumn] : []),
    ...(displayCategoriesCol ? [categoriesColumn] : []),
    ...(displayCommandsCol ? [commandsColumn] : []),
    ...(displayChannelsCol ? [channelsColumn] : []),
    creationDateColumn,
    statusColumn,
    actionsColumn,
  ] as ColumnDef<GenericUser>[];
};
