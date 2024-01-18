import { ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/ui/data-table';
import { GenericUser } from '@/data/cdb/users';
import UserStatusBadge from './userStatusBadge';

import UserActions from './userActions';
import { Badge } from '@/components/ui/badge';

interface UserListColumnsProps {
  displayGroupCol: boolean;
  displayRolesCol: boolean;
  onDeleteClicked: (user: GenericUser) => void;
  onResetPasswordClicked: (user: GenericUser) => void;
  lang?: string;
}
export const getColumns = ({
  displayGroupCol = false,
  displayRolesCol = false,
  onDeleteClicked,
  onResetPasswordClicked,
}: UserListColumnsProps) => {
  const userNameColumn: ColumnDef<GenericUser> = {
    id: 'username',
    header: ({ column }) => (
      <SortableHeader column={column}>Username</SortableHeader>
    ),
    accessorFn: (row) => row.username,
  };
  const groupColumn: ColumnDef<GenericUser> = {
    id: 'group',
    header: ({ column }) => (
      <SortableHeader column={column}>Group</SortableHeader>
    ),
    accessorFn: (row) => ('group' in row ? row.group : ''),
  };
  const rolesColumn: ColumnDef<GenericUser> = {
    id: 'roles',

    header: 'Roles',
    cell: ({ row }) => {
      const user = row.original;
      const roles: string[] = 'roles' in user ? user.roles : [];
      return (
        <div className="flex flex-col">
          {roles.map((role, index) => (
            <Badge variant={'outline'} key={index} className="text-xs w-fit" >{role}</Badge>
          ))}
        </div>
      );
    },
    accessorFn: (row) => ('roles' in row ? row.roles : ''),
  };
  const creationDateColumn: ColumnDef<GenericUser> = {
    id: 'Creation date',
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <SortableHeader column={column}>Creation date</SortableHeader>
    ),
    cell: ({ row }) => {
      const user = row.original;
      // TODO: change locale
      return new Intl.DateTimeFormat('fr-FR').format(new Date(user.createdAt));
    },
  };
  const statusColumn: ColumnDef<GenericUser> = {
    id: 'Status',
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
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
      />
    ),
  };
  return [
    userNameColumn,
    ...(displayGroupCol ? [groupColumn] : []),
    ...(displayRolesCol ? [rolesColumn] : []),
    creationDateColumn,
    statusColumn,
    actionsColumn,
  ];
};
