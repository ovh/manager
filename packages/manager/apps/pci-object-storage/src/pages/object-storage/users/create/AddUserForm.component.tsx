import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldLabel,
  Input,
  useToast,
} from '@datatr-ux/uxlib';
import { useAddUserForm } from './formAddUser/useAddUserForm.hook';
import { useAddS3User } from '@/data/hooks/user/useAddS3User.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useAddUser } from '@/data/hooks/user/useAddUser.hook';
import user from '@/types/User';
import { useGetUser } from '@/data/hooks/user/useGetUser.hook';
import UserInformation from '@/components/user-information/UserInformation.component';
import { POLLING } from '@/configuration/polling.constants';
import { FormField } from '@/components/form-field/FormField.component';
import { withPreventDefault } from '@/lib/formHelper';

interface AddUserFormProps {
  onClose?: (user: user.User) => void;
}
const AddUserForm = ({ onClose }: AddUserFormProps) => {
  const { projectId } = useParams();
  const [newUserId, setNewUserId] = useState<number>();
  const [newUserAccess, setNewUserAccess] = useState<string>();
  const [newUserSecret, setNewUserSecret] = useState<string>();
  const { t } = useTranslation('pci-object-storage/users/create');
  const toast = useToast();
  const { form } = useAddUserForm();

  const newUserQuery = useGetUser(projectId, newUserId, {
    enabled: !!newUserId,
    refetchInterval: (query) => {
      return query.state.data?.status === user.UserStatusEnum.ok
        ? false
        : POLLING.USER_CREATION;
    },
  });

  const { addS3User, isPending: isAddS3UserPending } = useAddS3User({
    onError: (err) => {
      toast.toast({
        title: t('addUserToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (data) => {
      const { access, secret } = data;

      setNewUserAccess(access);
      setNewUserSecret(secret);

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
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (newUser) => {
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
    setNewUserAccess(undefined);
    setNewUserSecret(undefined);
    onClose?.(newUserQuery.data);
  };

  return (
    <>
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="add-user-modal">
            {t('addUserTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {newUserId ? (
            <UserInformation
              newUser={newUserQuery.data}
              access={newUserAccess}
              secret={newUserSecret}
            />
          ) : (
            <form id="addUserForm" onSubmit={withPreventDefault(onSubmit)}>
              <FormField name="userName" form={form}>
                {(field) => (
                  <>
                    <FieldLabel htmlFor={'userName-input'}>
                      {t('userNameLabel')}
                    </FieldLabel>
                    <Input
                      disabled={isAddUserPending}
                      {...field}
                      data-testid="add-user-input"
                    />
                  </>
                )}
              </FormField>
            </form>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild onClick={() => handleClose()}>
            <Button
              disabled={
                (newUserId &&
                  newUserQuery.data?.status !== user.UserStatusEnum.ok) ||
                isAddS3UserPending
              }
              data-testid="add-user-close-button"
              type="button"
              mode="ghost"
            >
              {t(newUserId ? 'formAddUserButtonClose' : 'addUserButtonCancel')}
            </Button>
          </DialogClose>
          {!newUserId && (
            <Button
              type="submit"
              form="addUserForm"
              data-testid="add-user-submit-button"
              disabled={isAddS3UserPending}
            >
              {t('addUserButtonConfirm')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </>
  );
};

export default AddUserForm;
