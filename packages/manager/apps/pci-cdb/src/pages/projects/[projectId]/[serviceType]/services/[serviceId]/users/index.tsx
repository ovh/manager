import { useState } from 'react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useGetUsers } from '@/hooks/api/useGetUsers';
import { database } from '@/models/database';
import { DataTable } from '@/components/ui/data-table';
import { GenericUser, deleteUser, resetUserPassword } from '@/data/cdb/users';
import { getColumns } from './_components/userListTableColumns';
import AddUserModal from './_components/addUser/addUser';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useServiceData } from '../serviceData.hook';

type Message = {
  type?: 'default' | 'destructive' | 'success';
  title: string;
  content: JSX.Element;
};
const UsersPage = () => {
  const { projectId, service, serviceQuery } = useServiceData();
  if (!service) {
    return <>Loading</>;
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    refetchInterval: 30_000,
  });
  const resetPasswordMutation = useMutation({
    mutationFn: (userId: string) =>
      resetUserPassword(projectId, service.engine, service.id, userId),
    onSuccess: (data: database.service.UserWithPassword) => {
      usersQuery.refetch();
      serviceQuery.refetch();
      toast.success(`Your password has been changed to ${data.password}`);
      setMessages([
        {
          type: 'success',
          title: 'Password reset',
          content: (
            <div>
              Your password has been changed to{' '}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {data.password}
              </code>
            </div>
          ),
        },
        ...messages,
      ]);
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while updating your password: ${error.message}`,
      );
    },
  });
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) =>
      deleteUser(projectId, service.engine, service.id, userId),
    onSuccess: () => {
      usersQuery.refetch();
      serviceQuery.refetch();
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
      <div className="flex flex-col gap-2 mb-2">
        {messages.map((m, i) => (
          <Alert variant={m.type} key={i}>
            <AlertTitle>{m.title}</AlertTitle>
            <AlertDescription>{m.content}</AlertDescription>
          </Alert>
        ))}
      </div>
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
