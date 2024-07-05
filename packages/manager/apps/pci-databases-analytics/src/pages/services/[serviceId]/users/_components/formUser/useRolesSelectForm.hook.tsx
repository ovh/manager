import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { USER_CONFIG } from './user.constants';

interface UseRolesSelectFormProps {
  existingRoles: string[];
}
export const useRolesSelectForm = ({
  existingRoles,
}: UseRolesSelectFormProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const schema = z
    .object({
      role: z
        .string({ required_error: t('formUserRoleRequired') })
        .min(1, { message: t('formUserRoleRequired') }),
      customDB: z
        .string()
        .min(USER_CONFIG.roles.customInput.min, {
          message: t('formUserErrorMinLength', {
            min: USER_CONFIG.roles.customInput.min,
          }),
        })
        .max(USER_CONFIG.roles.customInput.max, {
          message: t('formUserErrorMaxLength', {
            min: USER_CONFIG.roles.customInput.max,
          }),
        }),
    })
    .refine(
      (newRole) =>
        !existingRoles.includes(
          newRole.role.replace(USER_CONFIG.roles.customTag, newRole.customDB),
        ),
      {
        message: t('formUserRoleDuplicate'),
      },
    )
    .refine(
      (newRole) =>
        !(
          newRole.customDB === 'admin' &&
          newRole.role.includes(USER_CONFIG.roles.customTag)
        ),
      {
        message: t('formUserRoleNoAdminValue'),
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
