import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import { useServiceData } from '../layout';
import { useGetUsers } from '@/hooks/api/users.api.hooks';
import { GenericUser } from '@/api/databases/users';
import { database } from '@/models/database';
import { getColumns } from './_components/usersTableColumns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useModale } from '@/hooks/useModale';
import DeleteUser from './_components/deleteUser';
import ResetUserPassword from './_components/resetUserPassword';
import { POLLING } from '@/configuration/polling';
import AddEditUserModal from './_components/addEditUser';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/users"
    />
  );
}

const Users = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const { projectId, service, serviceQuery } = useServiceData();
  const addEditModale = useModale('add-edit');
  const deleteModale = useModale('delete');
  const resetPasswordModale = useModale('reset-password');
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    refetchInterval: POLLING.USERS,
  });
  const columns: ColumnDef<GenericUser>[] = getColumns({
    displayGroupCol: service.engine === database.EngineEnum.m3db,
    displayRolesCol: [
      database.EngineEnum.mongodb,
      database.EngineEnum.postgresql,
    ].includes(service.engine),
    displayKeysCols: service.engine === database.EngineEnum.redis,
    displayCategoriesCol: service.engine === database.EngineEnum.redis,
    displayCommandsCol: service.engine === database.EngineEnum.redis,
    displayChannelsCol: service.engine === database.EngineEnum.redis,
    onDeleteClicked: (user: GenericUser) => {
      deleteModale.open(user.id);
    },
    onResetPasswordClicked: (user: GenericUser) => {
      resetPasswordModale.open(user.id);
    },
    onEditClicked: (user: GenericUser) => {
      addEditModale.open(user.id);
    },
  });

  const userToDelete = usersQuery.data?.find(
    (u) => u.id === deleteModale.value,
  );

  const userToEdit = usersQuery.data?.find((u) => u.id === addEditModale.value);

  const userToResetPassword = usersQuery.data?.find(
    (u) => u.id === resetPasswordModale.value,
  );
  return (
    <>
      <h2>{t('title')}</h2>
      {service.capabilities.users?.create && (
        <Button
          data-testid="users-add-button"
          variant={'outline'}
          size="sm"
          className="text-base"
          disabled={
            service.capabilities.users?.create ===
            database.service.capability.StateEnum.disabled
          }
          onClick={() => addEditModale.open()}
        >
          <Plus className="size-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}

      {usersQuery.isSuccess ? (
        <DataTable columns={columns} data={usersQuery.data} pageSize={25} />
      ) : (
        <div data-testid="users-table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}

      <AddEditUserModal
        isEdition={!!userToEdit}
        editedUser={userToEdit}
        controller={addEditModale.controller}
        service={service}
        users={usersQuery.data || []}
        onSuccess={() => {
          addEditModale.close();
          usersQuery.refetch();
          serviceQuery.refetch();
        }}
      />

      {userToDelete && (
        <DeleteUser
          controller={deleteModale.controller}
          service={service}
          user={userToDelete}
          onSuccess={() => {
            deleteModale.close();
            usersQuery.refetch();
            serviceQuery.refetch();
          }}
        />
      )}
      {userToResetPassword && (
        <ResetUserPassword
          controller={resetPasswordModale.controller}
          service={service}
          user={userToResetPassword}
          onClose={() => {
            resetPasswordModale.close();
            serviceQuery.refetch();
          }}
        />
      )}
    </>
  );
};

export default Users;
