import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { USER_CONFIG } from './user.constants';
import { UserAcl } from '@/types/cloud/project/database/opensearch';

interface UseAclsSelectFormProps {
  existingAcls: UserAcl[];
}
export const useAclsSelectForm = ({ existingAcls }: UseAclsSelectFormProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const schema = z
    .object({
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
    })
    .refine(
      (newAcl) =>
        !existingAcls.find(
          (acl) =>
            acl.pattern === newAcl.pattern &&
            acl.permission === newAcl.permission,
        ),
      {
        message: t('formUserAclDuplicate'),
      },
    );
  type ValidationSchema = z.infer<typeof schema>;
  // generate a form roleSchema
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      pattern: '',
      permission: USER_CONFIG.acls.permission.values[0],
    },
  });

  return { form, schema };
};
