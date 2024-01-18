import { useState } from 'react';
import { toast } from 'sonner';
import { useOutletContext } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useGetUsers } from '@/hooks/api/useGetUsers';
import { database } from '@/models/database';
import { DataTable } from '@/components/ui/data-table';
import { GenericUser, deleteUser, resetUserPassword } from '@/data/cdb/users';
import { getColumns } from './_components/userListTableColumns';
import AddUserModal from './_components/add/addUserModal';

const UsersPage = () => {
  const { projectId, serviceId } = useRequiredParams<{
    projectId: string;
    serviceId: string;
  }>();
  const service = useOutletContext() as database.Service;
  const usersQuery = useGetUsers(projectId, service.engine, serviceId, {
    refetchInterval: 30_000,
  });
  const resetPasswordMutation = useMutation({
    mutationFn: (userId: string) =>
      resetUserPassword(projectId, service.engine, serviceId, userId),
    onSuccess: (data: database.service.UserWithPassword) => {
      usersQuery.refetch();
      toast.success(`Your password has been changed to ${data.password}`);
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while updating your password: ${error.message}`,
      );
    },
  });
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) =>
      deleteUser(projectId, service.engine, serviceId, userId),
    onSuccess: () => {
      usersQuery.refetch();
      toast.success(`Your user has been correctly deleted`);
    },
    onError: (error: Error) => {
      toast.error(`A error occured while deleting your user: ${error.message}`);
    },
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const columns: ColumnDef<GenericUser>[] = getColumns({
    displayGroupCol: service.engine === database.EngineEnum.m3db,
    displayRolesCol: service.engine === database.EngineEnum.mongodb,
    onDeleteClicked: (user: GenericUser) => {
      deleteUserMutation.mutate(user.id);
    },
    onResetPasswordClicked: (user: GenericUser) => {
      resetPasswordMutation.mutate(user.id);
    },
  });
  return (
    <>
      {usersQuery.isSuccess ? (
        <>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="mb-2"
            variant="outline"
            size="sm"
          >
            Add a user {isAddModalOpen}
          </Button>
          <AddUserModal
            users={usersQuery.data}
            projectId={projectId}
            service={service}
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={(newUser: GenericUser) => {
              usersQuery.refetch();
              setIsAddModalOpen(false);
              toast.success(`Your user ${newUser.username} has been created`);
            }}
          />
          <DataTable columns={columns} data={usersQuery.data} pageSize={25} />
        </>
      ) : (
        <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
      )}
    </>
  );
};

export default UsersPage;
