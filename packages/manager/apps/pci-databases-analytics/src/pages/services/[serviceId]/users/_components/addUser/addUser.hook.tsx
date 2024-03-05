// formConfig.ts

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { USER_CONFIG } from './user.const';
import { database } from '@/models/database';
import { GenericUser } from '@/api/databases/users';

export interface UseAddUserFormProps {
  service: database.Service;
  existingUsers?: GenericUser[];
}
export const useAddUserForm = ({
  existingUsers = [],
  service,
}: UseAddUserFormProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const usedNames = existingUsers.map((u) =>
    u.username.includes('@') ? u.username.split('@')[0] : u.username,
  );

  const nameRules = z
    .string()
    .min(USER_CONFIG.name.min, {
      message: t('addUserErrorMinLength', { min: USER_CONFIG.name.min }),
    })
    .max(USER_CONFIG.name.max, {
      message: t('addUserErrorMaxLength', { max: USER_CONFIG.name.max }),
    })
    .regex(USER_CONFIG.name.pattern, {
      message: t('addUserNameErrorPattern'),
    })
    .refine((value) => !usedNames.includes(value), {
      message: t('addUserNameErrorDuplicate'),
    });

  const groupRules = z
    .string()
    .max(USER_CONFIG.group.max, {
      message: t('addUserErrorMaxLength', { max: USER_CONFIG.group.max }),
    })
    .refine((value) => value === '' || USER_CONFIG.group.pattern.test(value), {
      message: t('addUserGroupErrorPattern'),
    })
    .optional();

  const rolesRules = z.array(z.string());

  const keysInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.keys.min, {
        message: t('addUserErrorMinLength', { min: USER_CONFIG.keys.min }),
      })
      .max(USER_CONFIG.keys.max, {
        message: t('addUserErrorMaxLength', { min: USER_CONFIG.keys.max }),
      })
      .regex(USER_CONFIG.keys.pattern, {
        message: t('addUserKeyErrorPattern'),
      }),
  );
  const categoriesInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.categories.min, {
        message: t('addUserErrorMinLength', {
          min: USER_CONFIG.categories.min,
        }),
      })
      .max(USER_CONFIG.categories.max, {
        message: t('addUserErrorMaxLength', {
          min: USER_CONFIG.categories.max,
        }),
      })
      .regex(USER_CONFIG.categories.pattern, {
        message: t('addUserCategoriesErrorPattern'),
      }),
  );
  const commandsInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.commands.min, {
        message: t('addUserErrorMinLength', { min: USER_CONFIG.commands.min }),
      })
      .max(USER_CONFIG.commands.max, {
        message: t('addUserErrorMaxLength', { min: USER_CONFIG.commands.max }),
      })
      .regex(USER_CONFIG.commands.pattern, {
        message: t('addUserCommandsErrorPattern'),
      }),
  );
  const channelsInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.channels.min, {
        message: t('addUserErrorMinLength', { min: USER_CONFIG.channels.min }),
      })
      .max(USER_CONFIG.channels.max, {
        message: t('addUserErrorMaxLength', { min: USER_CONFIG.channels.max }),
      })
      .regex(USER_CONFIG.channels.pattern, {
        message: t('addUserChannelsErrorPattern'),
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
    case database.EngineEnum.postgresql:
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
