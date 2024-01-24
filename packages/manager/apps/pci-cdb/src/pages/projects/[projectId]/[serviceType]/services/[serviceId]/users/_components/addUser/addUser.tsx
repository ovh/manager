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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import RolesSelect from './rolesSelect';
import { useAddUserForm } from './addUser.hook';
import { useState } from 'react';
import { Tag, TagInput } from '@/components/ui/tag/tag-input';
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
  const formOptions = {
    existingUsers: users,
    groupInput: service.engine === database.EngineEnum.m3db,
    rolesInput: service.engine === database.EngineEnum.mongodb,
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

  const [tags, setTags] = useState<Tag[]>([]);
  const { setValue } = form;

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
            {formOptions.groupInput && (
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
            {formOptions.rolesInput && (
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

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Topics</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      minLength={5}
                      maxLength={32}
                      pattern="/^[+-][a-z@]{0,253}$/"
                      placeholder="Enter a command"
                      tags={tags}
                      className="sm:min-w-[450px]"
                      inputFieldPostion="top"
                      allowDuplicates={false}
                      textCase={null}
                      setTags={(newTags) => {
                        setTags(newTags);
                        const t = (newTags as Tag[]).map(tag => tag.text);
                        form.setValue('tags', t);
                      }}
                    />
                    {/* <TagsInput
                    {...field}
                    schema={schema.shape.tags}
                    />
                       */}
                  </FormControl>
                  <FormDescription>Add a command</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>

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
