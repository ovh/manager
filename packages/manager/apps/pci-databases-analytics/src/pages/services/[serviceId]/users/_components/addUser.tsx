import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { GenericUser, UserCreation } from '@/api/databases/users';
import { database } from '@/models/database';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import RolesSelect from './addUser/rolesSelect';
import { useAddUserForm } from './addUser/addUser.hook';
import TagsInput from '@/components/tags-input';
import { ModalController } from '@/hooks/useModale';
import { useAddUser } from '@/hooks/api/users.api.hooks';
import { useToast } from '@/components/ui/use-toast';

interface AddUserModalProps {
  users: GenericUser[];
  service: database.Service;
  controller: ModalController;
  onSuccess?: (user: GenericUser) => void;
  onError?: (error: Error) => void;
}
const AddUserModal = ({
  users,
  service,
  controller,
  onSuccess,
  onError,
}: AddUserModalProps) => {
  const { projectId } = useParams();
  const { form, schema } = useAddUserForm({
    existingUsers: users,
    service,
  });
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const toast = useToast();
  const { addUser, isPending } = useAddUser({
    onError: (err) => {
      toast.toast({
        title: t('addUserToastErrorTitle'),
        variant: 'destructive',
        description: err.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (user) => {
      toast.toast({
        title: t('addUserToastSuccessTitle'),
        description: t('addUserToastSuccessDescription', {
          name: user.username,
        }),
      });
      if (onSuccess) {
        onSuccess(user);
      }
    },
  });
  const onSubmit = form.handleSubmit((formValues) => {
    addUser({
      projectId,
      engine: service.engine,
      serviceId: service.id,
      user: formValues as UserCreation,
    });
  });

  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('addUserTitle')}</DialogTitle>
          <DialogDescription>{t('addUserDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            {/* UserName */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('addUserFieldNameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="name" disabled={isPending} {...field} />
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
                    <FormLabel>{t('addUserFieldGroupLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="group"
                        disabled={isPending}
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
                    <FormLabel>{t('addUserFieldRolesLabel')}</FormLabel>
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
                      {t('addUserFieldKeysLabel')}
                    </FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value}
                        onChange={(newTags) => form.setValue('keys', newTags)}
                        schema={
                          ('keys' in schema.shape &&
                            (schema.shape.keys as z.ZodArray<
                              z.ZodString,
                              'many'
                            >).element) ||
                          undefined
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
                      {t('addUserFieldCategoriesLabel')}
                    </FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value}
                        onChange={(newTags) =>
                          form.setValue('categories', newTags)
                        }
                        schema={
                          ('categories' in schema.shape &&
                            (schema.shape.categories as z.ZodArray<
                              z.ZodString,
                              'many'
                            >).element) ||
                          undefined
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
                      {t('addUserFieldCommandsLabel')}
                    </FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value}
                        onChange={(newTags) =>
                          form.setValue('commands', newTags)
                        }
                        schema={
                          ('commands' in schema.shape &&
                            (schema.shape.commands as z.ZodArray<
                              z.ZodString,
                              'many'
                            >).element) ||
                          undefined
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
                      {t('addUserFieldChannelsLabel')}
                    </FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value}
                        onChange={(newTags) =>
                          form.setValue('channels', newTags)
                        }
                        schema={
                          ('channels' in schema.shape &&
                            (schema.shape.channels as z.ZodArray<
                              z.ZodString,
                              'many'
                            >).element) ||
                          undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t('addUserButtonCancel')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {t('addUserButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
