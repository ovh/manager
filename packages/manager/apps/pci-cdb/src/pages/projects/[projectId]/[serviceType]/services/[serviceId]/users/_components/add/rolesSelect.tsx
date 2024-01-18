import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MinusCircle, PlusCircle } from 'lucide-react';
import React, { useEffect, useMemo, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface RoleSelectProps {
  value: string[];
  onChange: (newRoles: string[]) => void;
}

// TODO: get roles from api
const rolesList = [
  'backup@admin',
  'clusterAdmin@admin',
  'clusterManager@admin',
  'clusterMonitor@admin',
  'dbAdmin@(defined db)',
  'dbAdminAnyDatabase@admin',
  'dbOwner@(defined db)',
  'enableSharding@(defined db)',
  'hostManager@admin',
  'read@(defined db)',
  'readAnyDatabase@admin',
  'readWrite@(defined db)',
  'readWriteAnyDatabase@admin',
  'restore@admin',
  'root@admin',
  'userAdmin@(defined db)',
  'userAdminAnyDatabase@admin',
];

const RoleSelect = React.forwardRef<HTMLInputElement, RoleSelectProps>(
  ({ value, onChange }) => {
    const roleInputRef = useRef<HTMLButtonElement>(null);
    const addRoleBtnRef = useRef<HTMLButtonElement>(null);
    const scrollListRef = useRef<HTMLUListElement>(null);

    const roleSchema = z
      .object(
        {
          role: z
            .string({ required_error: 'Please select a role' })
            .min(1, { message: 'Please select a role' }),
          customDB: z
            .string()
            .min(1, { message: 'Please add a database name' })
            .max(32, { message: 'Please add a database name' }),
        },
        { description: 'root' },
      )
      .refine(
        (newRole) =>
          !value.includes(
            newRole.role.replace('(defined db)', newRole.customDB),
          ),
        {
          message: 'A similar role is already added',
        },
      );
    type ValidationSchema = z.infer<typeof roleSchema>;
    // generate a form roleSchema
    const form = useForm<ValidationSchema>({
      resolver: zodResolver(roleSchema),
      defaultValues: {
        role: '',
        customDB: '',
      },
    });

    const currentRole = form.watch('role');

    useEffect(() => {
      if (!currentRole.includes('(defined db)')) {
        form.setValue('customDB', 'admin');
      } else {
        form.setValue('customDB', '');
      }
    }, [currentRole, form]);

    useEffect(() => {
      const scrollContainer = scrollListRef.current;
      if (scrollContainer) {
        const { lastChild } = scrollContainer;
        if (lastChild instanceof Element) {
          lastChild.scrollIntoView({ behavior: 'smooth' });
        } else {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, [value, scrollListRef]);

    const handleAddRole: SubmitHandler<ValidationSchema> = (formValues) => {
      onChange([
        ...value,
        formValues.role.replace('(defined db)', formValues.customDB),
      ]);
      form.reset();
    };
    const handleRemoveRole = (index: number) => {
      const updatedRoles = [...value];
      updatedRoles.splice(index, 1);
      onChange(updatedRoles);
    };

    const availableRoles = useMemo(
      () =>
        rolesList.filter((r) => {
          if (r.includes('(defined db)')) return true;
          return value.indexOf(r) === -1;
        }),
      [value],
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        addRoleBtnRef.current?.click();
        roleInputRef.current?.focus();
        event.preventDefault();
      }
    };

    const errors = useMemo(() => {
      const messages: string[] = [];
      const formErrors = form.formState.errors;
      Object.keys(formErrors).forEach((key) => {
        const validKey = key as keyof typeof formErrors;
        const formError = formErrors[validKey];
        if (formError && formError.message) {
          messages.push(formError.message);
        }
      });

      return messages;
    }, [form.formState.errors]);

    return (
      <>
        <div className="flex w-full items-end">
          <div className="flex-grow">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger ref={roleInputRef}>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            <Badge>{role}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <span className="p-2">@</span>
          <div>
            <FormField
              control={form.control}
              name="customDB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter customDB"
                      {...field}
                      onKeyDown={handleKeyDown}
                      disabled={!currentRole.includes('(defined db)')}
                      readOnly={!currentRole.includes('(defined db)')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            ref={addRoleBtnRef}
            variant={'ghost'}
            type="button"
            onClick={form.handleSubmit(handleAddRole)}
            className="text-primary"
          >
            <PlusCircle />
          </Button>
        </div>
        <div>
          {errors.map((error, i) => (
            <span key={i} className="text-sm font-medium text-destructive">
              {error}
            </span>
          ))}
        </div>
        <div>
          <label>Selected Roles:</label>
          <ScrollArea className="h-72 rounded-md border">
            <ul ref={scrollListRef}>
              {value.map((role, index) => (
                <li key={index} className="flex items-center">
                  <Button
                    className="text-red-500"
                    size={'icon'}
                    variant={'ghost'}
                    type="button"
                    onClick={() => handleRemoveRole(index)}
                  >
                    <MinusCircle />
                  </Button>
                  <Badge>{role}</Badge>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </>
    );
  },
);

RoleSelect.displayName = 'RoleSelect';

export default RoleSelect;
