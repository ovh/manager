import { z } from 'zod';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CdbError } from '@/data/cdb/error';
import { GenericUser, UserCreation, createUser } from '@/data/cdb/users';
import { database } from '@/models/database';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import RolesSelect from './rolesSelect';
import { UseAddUserFormProps, useAddUserForm } from './addUser.hook';
import TagsInput from '@/components/tags-input';

interface AddUserModalProps {
  users: GenericUser[];
  projectId: string;
  service: database.Service;
  open: boolean;
  onClose: () => void;
  onSuccess: (user: GenericUser) => void; // TODO: add data type
}
const AddUserModal = ({
  users,
  projectId,
  service,
  open,
  onClose,
  onSuccess,
}: AddUserModalProps) => {
  const formOptions: UseAddUserFormProps = {
    existingUsers: users,
    service,
  };
  const { form, schema } = useAddUserForm(formOptions);
  type ValidationSchema = z.infer<typeof schema>;
  const createUserMutation = useMutation({
    mutationFn: (user: UserCreation) =>
      createUser(projectId, service.engine, service.id, user),
    onSuccess: (data: GenericUser) => {
      onSuccess(data);
      form.reset();
    },
    onError: (error: CdbError) => {
      toast.error(
        `A error occured while creating your user: ${error.response.data.message}`,
      );
    },
  });
  const handleFormSubmit: SubmitHandler<ValidationSchema> = (formValues) => {
    createUserMutation.mutate(formValues);
  };
  const handleClose = (value: boolean) => {
    if (value) return;
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a new user</DialogTitle>
          <DialogDescription>
            Create and configure a new user for your service.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-2"
          >
            {/* UserName */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
                      disabled={createUserMutation.isPending}
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
                    <FormLabel>Group</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="group"
                        disabled={createUserMutation.isPending}
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
                    <FormLabel>Roles</FormLabel>
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
                    <FormLabel className="text-left">Keys</FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value!}
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
                    <FormLabel className="text-left">Categories</FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value!}
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
                    <FormLabel className="text-left">Commands</FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value!}
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
                    <FormLabel className="text-left">Channels</FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        value={field.value!}
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
              <Button type="submit" disabled={createUserMutation.isPending}>
                Add user
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
