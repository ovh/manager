import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  // avoid creating duplicate user
  const usedNames = users.map((u) =>
    u.username.includes('@') ? u.username.split('@')[0] : u.username,
  );
  const nameRules = z
    .string()
    .min(1, {
      message: 'Minimum 1 character',
    })
    .max(32, {
      message: 'Maximum 32 characters',
    })
    .regex(/^\w[\w.-]*$/, {
      message:
        'Must contain letters and numbers, full stops (.), underscores (_) and dashes (-), must not start with a dash (-) or a full stop (.)',
    })
    .refine((value) => !usedNames.includes(value), {
      message: 'This username is already in use',
    });
  const groupRules = z
    .string()
    .max(16, { message: 'Maximum 16 characters' })
    .refine((value) => value === '' || /^\w[\w.-]*$/.test(value), {
      message:
        'Must contain letters and numbers, full stops (.), underscores (_) and dashes (-), must not start with a dash (-) or a full stop (.)',
    })
    .optional();
  const rolesRules = z.array(z.string());
  const schema = z.object({
    name: nameRules,
    group: groupRules,
    roles: rolesRules,
  });
  type ValidationSchema = z.infer<typeof schema>;
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      roles: [],
    },
  });
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
            {service.engine === database.EngineEnum.m3db && (
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
            {service.engine === database.EngineEnum.mongodb && (
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group</FormLabel>
                    <FormControl>
                      <RolesSelect {...field} />
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
