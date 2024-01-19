import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface UseRolesSelectFormProps {
  existingRoles: string[];
}
export const useRolesSelectForm = ({
  existingRoles,
}: UseRolesSelectFormProps) => {
  const schema = z
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
        !existingRoles.includes(
          newRole.role.replace('(defined db)', newRole.customDB),
        ),
      {
        message: 'A similar role is already added',
      },
    );
  type ValidationSchema = z.infer<typeof schema>;
  // generate a form roleSchema
  const form = useForm({
    resolver: zodResolver(schema),
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

  return { form, schema, currentRole };
};
