import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useToast,
} from '@datatr-ux/uxlib';
import {
  GenericUser,
  UserCreation,
  UserEdition,
} from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import TagsInput from '@/components/tags-input/TagsInput.component';
import {
  UseAddUser,
  useAddUser,
} from '@/hooks/api/database/user/useAddUser.hook';
import { useEditUser } from '@/hooks/api/database/user/useEditUser.hook';
import { useUserForm } from './formUser/useUserForm.hook';
import RolesSelect from './formUser/RolesSelect.component';
import { useServiceData } from '../../Service.context';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';
import AclsSelect from './formUser/AclsSelect.component';
import { UserAcl } from '@/types/cloud/project/database/opensearch';

interface AddEditUserModalProps {
  editedUser?: GenericUser;
  existingUsers: GenericUser[];
  service: database.Service;
  onSuccess?: (user?: GenericUser) => void;
  onError?: (error: Error) => void;
}
const AddEditUserModal = ({
  editedUser,
  existingUsers,
  service,
}: AddEditUserModalProps) => {
  const navigate = useNavigate();
  const { projectId } = useServiceData();

  const { form, schema } = useUserForm({
    existingUsers,
    service,
    editedUser,
  });

  const isEdition = !!editedUser?.id;

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const toast = useToast();
  const prefix = isEdition ? 'edit' : 'add';

  const UserMutationProps: UseAddUser = {
    onError: (err) => {
      toast.toast({
        title: t(`${prefix}UserToastErrorTitle`),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: (user) => {
      toast.toast({
        title: t('formUserToastSuccessTitle'),
        description: t(`${prefix}UserToastSuccessDescription`, {
          name: user.username,
        }),
      });
      navigate('../');
    },
  };

  const { addUser, isPending: isPendingAddUser } = useAddUser(
    UserMutationProps,
  );
  const { editUser, isPending: isPendingEditUser } = useEditUser(
    UserMutationProps,
  );

  const onSubmit = form.handleSubmit((formValues) => {
    if (isEdition) {
      const userEditionValue = {
        ...(formValues as UserEdition),
        id: editedUser.id,
      };
      if ('name' in userEditionValue) {
        delete userEditionValue.name;
      }
      editUser({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        user: userEditionValue,
      });
    } else {
      addUser({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        user: formValues as UserCreation,
      });
    }
  });

  return (
    <RouteModal isLoading={!existingUsers}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle data-testid="add-edit-user-modal">
            {t(`${prefix}UserTitle`)}
          </DialogTitle>
          {!isEdition && (
            <DialogDescription>{t('addUserDescription')}</DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            {/* UserName */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formUserFieldNameLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="add-edit-username-input"
                      placeholder="name"
                      disabled={
                        isPendingAddUser || isPendingEditUser || isEdition
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Group (m3db) */}
            {'group' in schema.shape && (
              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formUserFieldGroupLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="add-edit-group-input"
                        placeholder="group"
                        disabled={isPendingAddUser || isPendingEditUser}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {'roles' in schema.shape && (
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formUserFieldRolesLabel')}</FormLabel>
                    <FormControl>
                      <RolesSelect {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {'keys' in schema.shape && (
              <FormField
                control={form.control}
                name="keys"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-left">
                      {t('formUserFieldKeysLabel')}
                    </FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        data-testid="add-edit-keys-input"
                        value={field.value}
                        onChange={(newTags) => form.setValue('keys', newTags)}
                        schema={
                          'keys' in schema.shape &&
                          (schema.shape.keys as z.ZodArray<z.ZodString, 'many'>)
                            .element
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {'categories' in schema.shape && (
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-left">
                      {t('formUserFieldCategoriesLabel')}
                    </FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value}
                        onChange={(newTags) =>
                          form.setValue('categories', newTags)
                        }
                        schema={
                          'categories' in schema.shape &&
                          (schema.shape.categories as z.ZodArray<
                            z.ZodString,
                            'many'
                          >).element
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {'commands' in schema.shape && (
              <FormField
                control={form.control}
                name="commands"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-left">
                      {t('formUserFieldCommandsLabel')}
                    </FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value}
                        onChange={(newTags) =>
                          form.setValue('commands', newTags)
                        }
                        schema={
                          'commands' in schema.shape &&
                          (schema.shape.commands as z.ZodArray<
                            z.ZodString,
                            'many'
                          >).element
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {'channels' in schema.shape && (
              <FormField
                control={form.control}
                name="channels"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-left">
                      {t('formUserFieldChannelsLabel')}
                    </FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value}
                        onChange={(newTags) =>
                          form.setValue('channels', newTags)
                        }
                        schema={
                          'channels' in schema.shape &&
                          (schema.shape.channels as z.ZodArray<
                            z.ZodString,
                            'many'
                          >).element
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {'acls' in schema.shape && (
              <FormField
                control={form.control}
                name="acls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formUserFieldAclsLabel')}</FormLabel>
                    <FormControl>
                      <AclsSelect {...field} value={field.value as UserAcl[]} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  mode="outline"
                  data-testid="add-edit-user-cancel-button"
                >
                  {t('formUserButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPendingAddUser || isPendingEditUser}
                data-testid="add-edit-user-submit-button"
              >
                {t(`${prefix}UserButtonConfirm`)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default AddEditUserModal;
