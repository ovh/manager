import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { USER_CONFIG } from './user.const';

interface UseRolesSelectFormProps {
  existingRoles: string[];
}
export const useRolesSelectForm = ({
  existingRoles,
}: UseRolesSelectFormProps) => {
  const schema = z
    .object({
      role: z
        .string({ required_error: 'Please select a role' })
        .min(1, { message: 'Please select a role' }),
      customDB: z
        .string()
        .min(USER_CONFIG.roles.customInput.min, {
          message: 'Please add a database name',
        })
        .max(USER_CONFIG.roles.customInput.max, {
          message: 'Please add a database name',
        }),
    })
    .refine(
      (newRole) =>
        !existingRoles.includes(
          newRole.role.replace(USER_CONFIG.roles.customTag, newRole.customDB),
        ),
      {
        message: 'A similar role is already added',
      },
    )
    .refine(
      (newRole) =>
        !(
          newRole.customDB === 'admin' &&
          newRole.role.includes(USER_CONFIG.roles.customTag)
        ),
      {
        message: 'This role does not allow "admin" value',
      },
    );
  type ValidationSchema = z.infer<typeof schema>;
  // generate a form roleSchema
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: '',
      customDB: '',
    },
  });

  const currentRole = form.watch('role');

  useEffect(() => {
    if (!currentRole.includes(USER_CONFIG.roles.customTag)) {
      form.setValue('customDB', 'admin');
    } else {
      form.setValue('customDB', '');
    }
  }, [currentRole, form]);

  return { form, schema, currentRole };
};
