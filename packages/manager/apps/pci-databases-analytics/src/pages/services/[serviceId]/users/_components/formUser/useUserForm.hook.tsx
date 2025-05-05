import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { USER_CONFIG } from './user.constants';
import * as database from '@/types/cloud/project/database';
import { GenericUser } from '@/data/api/database/user.api';

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

  const nameRules = editedUser
    ? z.string()
    : z
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
  const aclsInputRules = z.array(
    z.object({
      pattern: z
        .string()
        .min(USER_CONFIG.acls.pattern.min, {
          message: t('formUserErrorMinLength', {
            min: USER_CONFIG.acls.pattern.min,
          }),
        })
        .max(USER_CONFIG.acls.pattern.max, {
          message: t('formUserErrorMaxLength', {
            min: USER_CONFIG.acls.pattern.max,
          }),
        })
        .regex(USER_CONFIG.acls.pattern.pattern, {
          message: t('formUseAclPatternErrorPattern'),
        }),
      permission: z
        .string()
        .min(1, {
          message: t('formUserErrorRequiredField'),
        })
        .refine((val) => USER_CONFIG.acls.permission.values.includes(val), {
          message: t('formUserInvalidPermission', {
            values: USER_CONFIG.acls.permission.values.join(', '),
          }),
        }),
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
  const openSearchSchema = baseSchema.merge(
    z.object({
      acls: aclsInputRules,
    }),
  );
  const schemaGroup = baseSchema.merge(groupSchema);

  type ValidationSchema =
    | z.infer<typeof baseSchema>
    | z.infer<typeof schemaGroup>
    | z.infer<typeof roleschema>
    | z.infer<typeof redisSchema>
    | z.infer<typeof openSearchSchema>;

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

  switch (service.engine) {
    case database.EngineEnum.m3db:
      schema = groupSchema;
      defaultValues = {
        ...defaultValues,
        group: (editedUser as database.m3db.User)?.group || '',
      };
      break;
    case database.EngineEnum.postgresql:
    case database.EngineEnum.mongodb:
      schema = roleschema;
      defaultValues = {
        ...defaultValues,
        roles: (editedUser as database.service.UserWithRoles)?.roles || [],
      };
      break;
    case database.EngineEnum.valkey:
    case database.EngineEnum.redis:
      schema = redisSchema;
      defaultValues = {
        ...defaultValues,
        categories: (editedUser as database.redis.User)?.categories || [],
        keys: (editedUser as database.redis.User)?.keys || [],
        commands: (editedUser as database.redis.User)?.commands || [],
        channels: (editedUser as database.redis.User)?.channels || [],
      };
      break;
    case database.EngineEnum.opensearch:
      if ('aclsEnabled' in service && service.aclsEnabled) {
        schema = openSearchSchema;
        defaultValues = {
          ...defaultValues,
          acls: (editedUser as database.opensearch.User)?.acls || [],
        };
      } else {
        schema = baseSchema;
      }
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
