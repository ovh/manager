// formConfig.ts

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GenericUser } from '@/data/cdb/users';

interface UseAddUserFormProps {
  groupInput?: boolean;
  rolesInput?: boolean;
  existingUsers?: GenericUser[];
}
export const useAddUserForm = ({
  existingUsers = [],
  // groupInput = false,
  rolesInput = false,
}: UseAddUserFormProps) => {
  const { t } = useTranslation('common');

  const usedNames = existingUsers.map((u) =>
    u.username.includes('@') ? u.username.split('@')[0] : u.username,
  );

  const nameRules = z
    .string()
    .min(1, {
      message: t('min_length_error', { min: 3 }),
    })
    .max(32, {
      message: t('min_length_error', { max: 32 }),
    })
    .regex(/^\w[\w.-]*$/, {
      message:
        'Must contain letters and numbers, full stops (.), underscores (_), and dashes (-), must not start with a dash (-) or a full stop (.)',
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

  const rolesRules = z.array(z.string()).optional();

  const schema = z.object({
    name: nameRules,
    group: groupRules,
    roles: rolesRules,
  });

  const defaultValues: ValidationSchema = { name: '' };
  if (rolesInput) defaultValues.roles = [];

  type ValidationSchema = z.infer<typeof schema>;

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
