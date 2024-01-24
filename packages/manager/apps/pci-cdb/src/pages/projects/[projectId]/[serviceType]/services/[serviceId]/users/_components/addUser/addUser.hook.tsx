// formConfig.ts

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GenericUser } from '@/data/cdb/users';
import { USER_CONFIG } from './user.const';

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
    .min(USER_CONFIG.name.min, {
      message: t('min_length_error', { min: USER_CONFIG.name.min }),
    })
    .max(USER_CONFIG.name.max, {
      message: t('min_length_error', { max: USER_CONFIG.name.max }),
    })
    .regex(USER_CONFIG.name.pattern, {
      message:
        'Must contain letters and numbers, full stops (.), underscores (_), and dashes (-), must not start with a dash (-) or a full stop (.)',
    })
    .refine((value) => !usedNames.includes(value), {
      message: 'This username is already in use',
    });

  const groupRules = z
    .string()
    .max(USER_CONFIG.group.max, { message: 'Maximum 16 characters' })
    .refine((value) => value === '' || USER_CONFIG.group.pattern.test(value), {
      message:
        'Must contain letters and numbers, full stops (.), underscores (_) and dashes (-), must not start with a dash (-) or a full stop (.)',
    })
    .optional();

  const rolesRules = z.array(z.string()).optional();

  const tagsRules = z.array(
    z
      .string()
      .min(USER_CONFIG.name.min, {
        message: t('min_length_error', { min: USER_CONFIG.name.min }),
      })
      .regex(/^[+-][a-z@]{0,253}$/, {
        message:
          'Must start by a + or a - and contain only metters, numbers ans arobases (@)',
      }),
  ).min(1, { message: 'minimum'});

  const schema = z.object({
    name: nameRules,
    group: groupRules,
    roles: rolesRules,
    tags: tagsRules,
  });

  const defaultValues: ValidationSchema = { name: '', tags: [] };
  if (rolesInput) defaultValues.roles = [];

  type ValidationSchema = z.infer<typeof schema>;

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
