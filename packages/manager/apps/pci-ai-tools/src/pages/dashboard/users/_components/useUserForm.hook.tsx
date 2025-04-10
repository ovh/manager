import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import ai from '@/types/AI';
import { USER_CONFIG } from './users.constants';

export const useUserForm = () => {
  const { t } = useTranslation('ai-tools/dashboard/users');

  const descriptionRules = z
    .string()
    .trim()
    .min(USER_CONFIG.description.min, {
      message: t('formUserErrorMinLength', {
        min: USER_CONFIG.description.min,
      }),
    })
    .max(USER_CONFIG.description.max, {
      message: t('formUserErrorMaxLength', {
        max: USER_CONFIG.description.max,
      }),
    })
    .regex(USER_CONFIG.description.pattern, {
      message: t('formUserNameErrorPattern'),
    });

  const userRoleRules = z.nativeEnum(ai.TokenRoleEnum);

  const schema = z.object({
    description: descriptionRules,
    userRole: userRoleRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    description: '',
    userRole: ai.TokenRoleEnum.ai_training_operator,
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
