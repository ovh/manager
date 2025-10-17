import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@datatr-ux/uxlib';
import { useAddUserForm } from './formAddUser/useAddUserForm.hook';
import { useAddS3User } from '@/data/hooks/user/useAddS3User.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useAddUser } from '@/data/hooks/user/useAddUser.hook';
import user from '@/types/User';
import { useGetUser } from '@/data/hooks/user/useGetUser.hook';
import UserInformation from '@/components/user-information/userInformation.component';

interface AddUserFormProps {
  onClose?: (user: user.User) => void;
}
const AddUserForm = ({ onClose }: AddUserFormProps) => {
  const { projectId } = useParams();
  const [newUserId, setNewUserId] = useState<number>();
  const [newUserPwd, setNewUserPwd] = useState<string>();
  const { t } = useTranslation('pci-object-storage/users/create');
  const toast = useToast();
  const { form } = useAddUserForm();

  const newUserQuery = useGetUser(projectId, newUserId, {
    enabled: !!newUserId,
    refetchInterval: (query) => {
      return query.state.data?.status === user.UserStatusEnum.ok ? false : 2500;
    },
  });

  const { addS3User, isPending: isAddS3UserPending } = useAddS3User({
    onError: (err) => {
      toast.toast({
        title: t('addUserToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('addUserToastSuccessTitle'),
        description: t('addUserToastSuccessDescription', {
          name: newUserQuery.data?.username,
        }),
      });
    },
  });

  const { addUser, isPending: isAddUserPending } = useAddUser({
    onError: (err) => {
      toast.toast({
        title: t('addUserToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (newUser) => {
      setNewUserPwd(newUser.password);
      setNewUserId(newUser.id);
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    addUser({
      projectId,
      newUser: {
        description: formValues.userName,
        role: user.RoleEnum.objectstore_operator,
      },
    });
  });

  useEffect(() => {
    if (newUserQuery.isLoading) return;
    if (newUserQuery.data?.status !== user.UserStatusEnum.ok) return;
    addS3User({
      projectId,
      userId: newUserQuery.data.id,
    });
  }, [newUserQuery.data]);

  const handleClose = () => {
    setNewUserId(undefined);
    setNewUserPwd(undefined);
    onClose?.(newUserQuery.data);
  };

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="add-user-modal">
            {t('addUserTitle')}
          </DialogTitle>
        </DialogHeader>
        {newUserPwd ? (
          <>
            <UserInformation pwd={newUserPwd} newUser={newUserQuery.data} />
            <DialogFooter className="flex justify-end mt-4">
              <DialogClose asChild onClick={() => handleClose()}>
                <Button
                  disabled={
                    newUserQuery.data?.status !== user.UserStatusEnum.ok ||
                    isAddS3UserPending
                  }
                  data-testid="add-user-close-button"
                  type="button"
                  mode="outline"
                >
                  {t('formAddUserButtonClose')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('userNameLabel')}</FormLabel>
                    <FormControl>
                      <Input disabled={isAddUserPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-end mt-4">
                <DialogClose asChild>
                  <Button type="button" mode="outline">
                    {t('addUserButtonCancel')}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  data-testid="add-user-submit-button"
                  disabled={isAddS3UserPending}
                >
                  {t('addUserButtonConfirm')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </>
  );
};

export default AddUserForm;
