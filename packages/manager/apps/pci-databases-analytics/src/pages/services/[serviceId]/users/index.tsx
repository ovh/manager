import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import { H2 } from '@/components/typography';
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
  const addModale = useModale('add');
  const editModale = useModale('edit');
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
    onDeleteClicked: (user: GenericUser) => {
      deleteModale.open(user.id);
    },
    onResetPasswordClicked: (user: GenericUser) => {
      resetPasswordModale.open(user.id);
    },
    onEditClicked: (user: GenericUser) => {
      editModale.open(user.id);
    },
  });

  const userToDelete = usersQuery.data?.find(
    (u) => u.id === deleteModale.value,
  );

  const userToEdit = usersQuery.data?.find((u) => u.id === editModale.value);

  const userToResetPassword = usersQuery.data?.find(
    (u) => u.id === resetPasswordModale.value,
  );
  return (
    <>
      <H2>{t('title')}</H2>
      {service.capabilities.users?.create && (
        <Button
          variant={'outline'}
          size="sm"
          className="text-base"
          disabled={
            service.capabilities.users?.create ===
            database.service.capability.StateEnum.disabled
          }
          onClick={() => addModale.open()}
        >
          <Plus className="size-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}

      {usersQuery.isSuccess ? (
        <DataTable columns={columns} data={usersQuery.data} pageSize={25} />
      ) : (
        <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
      )}

      <AddEditUserModal
        isEdition={false}
        controller={addModale.controller}
        service={service}
        users={usersQuery.data || []}
        onSuccess={() => {
          addModale.close();
          usersQuery.refetch();
          serviceQuery.refetch();
        }}
      />

      {userToEdit && (
        <AddEditUserModal
          isEdition={true}
          editedUser={userToEdit}
          controller={editModale.controller}
          service={service}
          users={usersQuery.data || []}
          onSuccess={() => {
            editModale.close();
            usersQuery.refetch();
            serviceQuery.refetch();
          }}
        />
      )}

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
