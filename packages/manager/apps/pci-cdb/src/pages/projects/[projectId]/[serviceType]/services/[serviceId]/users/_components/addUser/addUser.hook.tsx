// formConfig.ts

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GenericUser } from '@/data/cdb/users';
import { USER_CONFIG } from './user.const';
import { database } from '@/models/database';

export interface UseAddUserFormProps {
  service: database.Service;
  existingUsers?: GenericUser[];
}
export const useAddUserForm = ({
  existingUsers = [],
  service,
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
      message: t('max_length_error', { max: USER_CONFIG.name.max }),
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

  const rolesRules = z.array(z.string());

  const keysInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.keys.min, {
        message: t('min_length_error', { min: USER_CONFIG.keys.min }),
      })
      .max(USER_CONFIG.keys.max, {
        message: t('maw_length_error', { min: USER_CONFIG.keys.max }),
      })
      .regex(USER_CONFIG.keys.pattern, {
        message:
          'Must start by a + or a - and contain only metters, numbers ans arobases (@)',
      }),
  );
  const categoriesInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.categories.min, {
        message: t('min_length_error', { min: USER_CONFIG.categories.min }),
      })
      .max(USER_CONFIG.categories.max, {
        message: t('maw_length_error', { min: USER_CONFIG.categories.max }),
      })
      .regex(USER_CONFIG.categories.pattern, {
        message:
          'Must start by a + or a - and contain only metters, numbers ans arobases (@)',
      }),
  );
  const commandsInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.commands.min, {
        message: t('min_length_error', { min: USER_CONFIG.commands.min }),
      })
      .max(USER_CONFIG.commands.max, {
        message: t('maw_length_error', { min: USER_CONFIG.commands.max }),
      })
      .regex(USER_CONFIG.commands.pattern, {
        message:
          'Must start by a + or a - and contain only metters, numbers ans arobases (@)',
      }),
  );
  const channelsInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.channels.min, {
        message: t('min_length_error', { min: USER_CONFIG.channels.min }),
      })
      .max(USER_CONFIG.channels.max, {
        message: t('maw_length_error', { min: USER_CONFIG.channels.max }),
      })
      .regex(USER_CONFIG.channels.pattern, {
        message:
          'Must start by a + or a - and contain only metters, numbers ans arobases (@)',
      }),
  );

  const baseSchema = z.object({
    name: nameRules,
  });
  const groupSchema = baseSchema.merge(
    z.object({
      group: groupRules,
    }),
  );
  const roleschema = baseSchema.merge(
    z.object({
      roles: rolesRules,
    }),
  );
  const redisSchema = baseSchema.merge(
    z.object({
      categories: categoriesInputRules,
      keys: keysInputRules,
      commands: commandsInputRules,
      channels: channelsInputRules,
    }),
  );
  const schemaGroup = baseSchema.merge(groupSchema);
  type ValidationSchema =
    | z.infer<typeof baseSchema>
    | z.infer<typeof schemaGroup>
    | z.infer<typeof roleschema>
    | z.infer<typeof redisSchema>;

  let schema;
  let defaultValues: ValidationSchema = { name: '' };
  switch (service.engine) {
    case database.EngineEnum.m3db:
      schema = groupSchema;
      defaultValues = { ...defaultValues, group: '' };
      break;
    case database.EngineEnum.mongodb:
      schema = roleschema;
      defaultValues = { ...defaultValues, roles: [] };
      break;
    case database.EngineEnum.redis:
      schema = redisSchema;
      defaultValues = {
        ...defaultValues,
        categories: [],
        keys: [],
        commands: [],
        channels: [],
      };
      break;
    default:
      schema = baseSchema;
      break;
  }

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
