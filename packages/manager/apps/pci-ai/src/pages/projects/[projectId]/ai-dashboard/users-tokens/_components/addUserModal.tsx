import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, ChevronDown } from 'lucide-react';

import { ai } from '@/models/types';
import { formattedTokenRole } from '@/data/constant';
import { Input } from '@/components/ui/input';

export interface addUserSubmitData {
  description: string;
  userRole : string;
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: addUserSubmitData) => void;
}

const AddUserModal = ({ open, onClose, onSubmit }: AddUserModalProps) => {
  // define the schema for the form
  const schema = z.object({
    description: z
        .string()
        .min(1)
        .max(30),
    userRole: z.string({
      required_error: 'Please select a user role',
    }),
  });

  type ValidationSchema = z.infer<typeof schema>;

  // generate a form controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      userRole: formattedTokenRole(ai.TokenRoleEnum.ai_training_operator),
    },
  });

  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    form.reset();
    onSubmit({
      description: formValues.description,
      userRole: userRoleList.find((user) => user.value === formValues.userRole)?.key || "",
    });
  };

  const userRoleList = [
    { key: ai.TokenRoleEnum.ai_training_operator, value: formattedTokenRole(ai.TokenRoleEnum.ai_training_operator)},
    { key: ai.TokenRoleEnum.ai_training_read, value: formattedTokenRole(ai.TokenRoleEnum.ai_training_read) },
  ];

  const handleClose = (value: boolean) => {
    if (value) return;
    form.reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent>
        <DialogTitle>Create an AI user</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitAndForward)} className="space-y-8">
          <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Description</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Role</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="combobox"
                          role="combobox"
                          className={cn(
                            'justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? userRoleList.find(
                                (userRole) => userRole.value === field.value,
                              )?.value
                            : 'Select your Role'}
                          <ChevronDown className="text-primary ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search role type" />
                        <CommandGroup>
                          {userRoleList.map((userRole) => (
                            <CommandItem
                              value={userRole.value}
                              key={userRole.key}
                              onSelect={() => {
                                form.setValue('userRole', userRole.value || '');
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  userRole.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {userRole.value}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <DialogClose></DialogClose>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
