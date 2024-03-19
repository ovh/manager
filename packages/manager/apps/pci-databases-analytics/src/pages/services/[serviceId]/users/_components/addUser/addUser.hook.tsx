// formConfig.ts

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { USER_CONFIG } from './user.const';
import { database } from '@/models/database';
import { GenericUser } from '@/api/databases/users';

export interface UseUserFormProps {
  service: database.Service;
  existingUsers?: GenericUser[];
  editedUser?: GenericUser;
}
export const useUserForm = ({
  existingUsers = [],
  service,
  editedUser,
}: UseUserFormProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const usedNames = existingUsers
    .filter((c) => c.username !== editedUser?.username)
    .map((u) =>
      u.username.includes('@') ? u.username.split('@')[0] : u.username,
    );

  const nameRules = z
    .string()
    .min(USER_CONFIG.name.min, {
      message: t('formUserErrorMinLength', { min: USER_CONFIG.name.min }),
    })
    .max(USER_CONFIG.name.max, {
      message: t('formUserErrorMaxLength', { max: USER_CONFIG.name.max }),
    })
    .regex(USER_CONFIG.name.pattern, {
      message: t('formUserNameErrorPattern'),
    })
    .refine((value) => !usedNames.includes(value), {
      message: t('formUserNameErrorDuplicate'),
    });

  const groupRules = z
    .string()
    .max(USER_CONFIG.group.max, {
      message: t('formUserErrorMaxLength', { max: USER_CONFIG.group.max }),
    })
    .refine((value) => value === '' || USER_CONFIG.group.pattern.test(value), {
      message: t('formUserGroupErrorPattern'),
    })
    .optional();

  const rolesRules = z.array(z.string());

  const keysInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.keys.min, {
        message: t('formUserErrorMinLength', { min: USER_CONFIG.keys.min }),
      })
      .max(USER_CONFIG.keys.max, {
        message: t('formUserErrorMaxLength', { min: USER_CONFIG.keys.max }),
      })
      .regex(USER_CONFIG.keys.pattern, {
        message: t('formUserKeyErrorPattern'),
      }),
  );
  const categoriesInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.categories.min, {
        message: t('formUserErrorMinLength', {
          min: USER_CONFIG.categories.min,
        }),
      })
      .max(USER_CONFIG.categories.max, {
        message: t('formUserErrorMaxLength', {
          min: USER_CONFIG.categories.max,
        }),
      })
      .regex(USER_CONFIG.categories.pattern, {
        message: t('formUserCategoriesErrorPattern'),
      }),
  );
  const commandsInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.commands.min, {
        message: t('formUserErrorMinLength', { min: USER_CONFIG.commands.min }),
      })
      .max(USER_CONFIG.commands.max, {
        message: t('formUserErrorMaxLength', { min: USER_CONFIG.commands.max }),
      })
      .regex(USER_CONFIG.commands.pattern, {
        message: t('formUserCommandsErrorPattern'),
      }),
  );
  const channelsInputRules = z.array(
    z
      .string()
      .min(USER_CONFIG.channels.min, {
        message: t('formUserErrorMinLength', { min: USER_CONFIG.channels.min }),
      })
      .max(USER_CONFIG.channels.max, {
        message: t('formUserErrorMaxLength', { min: USER_CONFIG.channels.max }),
      })
      .regex(USER_CONFIG.channels.pattern, {
        message: t('formUserChannelsErrorPattern'),
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
  // Manage MongoDb case with name that include @
  let defaultName = '';
  if (editedUser) {
    defaultName = editedUser?.username.includes('@')
      ? editedUser.username.split('@')[0]
      : editedUser.username;
  }

  let defaultValues: ValidationSchema = {
    name: defaultName,
  };

  let m3dbEditedUser: database.m3db.User;
  let pgOrMongoeditedUser: database.service.UserWithRoles;
  let redisEditedUser: database.redis.User;
  switch (service.engine) {
    case database.EngineEnum.m3db:
      if (editedUser) {
        if ('group' in editedUser) {
          m3dbEditedUser = { ...editedUser };
        }
      }
      schema = groupSchema;
      defaultValues = { ...defaultValues, group: m3dbEditedUser?.group || '' };
      break;
    case database.EngineEnum.postgresql:
    case database.EngineEnum.mongodb:
      if (editedUser) {
        if ('roles' in editedUser) {
          pgOrMongoeditedUser = { ...editedUser };
        }
      }
      schema = roleschema;
      defaultValues = {
        ...defaultValues,
        roles: pgOrMongoeditedUser?.roles || [],
      };
      break;
    case database.EngineEnum.redis:
      if (editedUser) {
        if ('channels' in editedUser) {
          redisEditedUser = { ...editedUser };
        }
      }
      schema = redisSchema;
      defaultValues = {
        ...defaultValues,
        categories: redisEditedUser?.categories || [],
        keys: redisEditedUser?.keys || [],
        commands: redisEditedUser?.commands || [],
        channels: redisEditedUser?.channels || [],
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
