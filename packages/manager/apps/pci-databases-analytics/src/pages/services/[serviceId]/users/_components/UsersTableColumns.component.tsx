import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { GenericUser } from '@/data/api/database/user.api';
import { SortableHeader } from '@/components/ui/data-table';
import UserStatusBadge from './UserStatusBadge.component';
import UserActions from './UsersTableActions.component';

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
    cell: ({ row }) => (
      <div className="flex gap-2">
        {'keys' in row.original &&
          row.original.keys.map((key) => (
            <div
              key={`${key}`}
              className="border rounded-sm px-2.5 py-0.5 text-xs flex gap-2 items-center"
            >
              <span>{key}</span>
            </div>
          ))}
      </div>
    ),
  };
  const categoriesColumn: ColumnDef<GenericUser> = {
    id: 'categories',
    header: ({ column }) => (
      <SortableHeader column={column}>
        {t('tableHeadCategories')}
      </SortableHeader>
    ),
    accessorFn: (row) => ('categories' in row ? row.categories.length : ''),
    cell: ({ row }) => (
      <div className="flex gap-2">
        {'categories' in row.original &&
          row.original.categories.map((category) => (
            <div
              key={`${category}`}
              className="border rounded-sm px-2.5 py-0.5 text-xs flex gap-2 items-center"
            >
              <span>{category}</span>
            </div>
          ))}
      </div>
    ),
  };
  const commandsColumn: ColumnDef<GenericUser> = {
    id: 'commands',
    header: ({ column }) => (
      <SortableHeader column={column}>{t('tableHeadCommands')}</SortableHeader>
    ),
    accessorFn: (row) => ('commands' in row ? row.commands.length : ''),
    cell: ({ row }) => (
      <div className="flex gap-2">
        {'commands' in row.original &&
          row.original.commands.map((command) => (
            <div
              key={`${command}`}
              className="border rounded-sm px-2.5 py-0.5 text-xs flex gap-2 items-center"
            >
              <span>{command}</span>
            </div>
          ))}
      </div>
    ),
  };
  const channelsColumn: ColumnDef<GenericUser> = {
    id: 'channels',
    header: ({ column }) => (
      <SortableHeader column={column}>{t('tableHeadChannels')}</SortableHeader>
    ),
    accessorFn: (row) => ('channels' in row ? row.channels.length : ''),
    cell: ({ row }) => (
      <div className="flex gap-2">
        {'channels' in row.original &&
          row.original.channels.map((channel) => (
            <div
              key={`${channel}`}
              className="border rounded-sm px-2.5 py-0.5 text-xs flex gap-2 items-center"
            >
              <span>{channel}</span>
            </div>
          ))}
      </div>
    ),
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
