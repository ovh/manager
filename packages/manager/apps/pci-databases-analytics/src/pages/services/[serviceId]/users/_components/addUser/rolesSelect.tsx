import { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { MinusCircle, PlusCircle } from 'lucide-react';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useRolesSelectForm } from './rolesSelect.hook';
import { USER_CONFIG } from './user.const';

interface RoleSelectProps {
  value: string[] | undefined;
  onChange: (newRoles: string[] | undefined) => void;
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
  ({ value, onChange }, ref) => {
    const { t } = useTranslation(
      'pci-databases-analytics/services/service/users',
    );
    if (value === undefined) return <></>;
    const roleInputRef = useRef<HTMLButtonElement>(null);
    const addRoleBtnRef = useRef<HTMLButtonElement>(null);
    const scrollListRef = useRef<HTMLUListElement>(null);

    const { form, schema, currentRole } = useRolesSelectForm({
      existingRoles: value,
    });
    type ValidationSchema = z.infer<typeof schema>;

    // Scroll to the bottom of the list when a new role is added
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        addRoleBtnRef.current?.click();
        roleInputRef.current?.focus();
        event.preventDefault();
      }
    };

    const getRoleName = (role: string) => {
      return role.split('@')[0];
    };

    const availableRoles = useMemo(
      () => {
        type AvailableRoles = { admin: string[]; custom: string[] };
        const defaultValue: AvailableRoles = { admin: [], custom: [] };

        return rolesList.reduce((acc, curr) => {
          const isCustom = curr.includes('(defined db)');

          if (isCustom) {
            acc.custom.push(curr);
          } else if (value.indexOf(curr) === -1) {
            acc.admin.push(curr); // If not custom, assuming it's an admin role
          }

          return acc;
        }, defaultValue);
      },
      [rolesList, value], // Include rolesList in the dependency array if it's used inside useMemo
    );

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
                <FormItem ref={ref}>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger ref={roleInputRef}>
                        <SelectValue
                          placeholder={t('addUserRoleInputPlaceholder')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.admin.length > 0 && (
                          <SelectGroup>
                            <SelectLabel>
                              {t('addUserRoleInputAdminRoles')}
                            </SelectLabel>
                            {availableRoles.admin.map((role) => (
                              <SelectItem
                                key={role}
                                value={role}
                                className="cursor-pointer"
                              >
                                <Badge>{getRoleName(role)}</Badge>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                        <SelectGroup>
                          <SelectLabel>
                            {t('addUserRoleInputCustomRoles')}
                          </SelectLabel>
                          {availableRoles.custom.map((role) => (
                            <SelectItem
                              key={role}
                              value={role}
                              className="cursor-pointer"
                            >
                              <Badge>{getRoleName(role)}</Badge>
                            </SelectItem>
                          ))}
                        </SelectGroup>
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
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('addUserRoleDatabaseInputPlaceholder')}
                      {...field}
                      onKeyDown={handleKeyDown}
                      disabled={
                        !currentRole.includes(USER_CONFIG.roles.customTag)
                      }
                      readOnly={
                        !currentRole.includes(USER_CONFIG.roles.customTag)
                      }
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
            className="text-primary rounded-full p-2 ml-2 hover:text-primary"
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
          <label>{t('addUserRoleDatabaseConfiguredRoles')}</label>
          <ScrollArea className="h-40 rounded-md border">
            <ul ref={scrollListRef}>
              {value.map((role, index) => (
                <li key={index} className="flex items-center">
                  <Button
                    className="text-destructive rounded-full p-2 ml-2 hover:text-destructive h-8 w-8"
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
