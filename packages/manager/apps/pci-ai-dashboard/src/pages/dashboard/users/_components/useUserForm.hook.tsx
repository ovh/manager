import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { USER_CONFIG } from './users.constants';
import * as ai from '@/types/cloud/project/ai';

export const useUserForm = () => {
  const { t } = useTranslation('pci-ai-dashboard/users');

  const descriptionRules = z
    .string()
    .min(USER_CONFIG.description.min, {
      message: t('formUserErrorMinLength', {
        min: USER_CONFIG.description.min,
      }),
    })
    .max(USER_CONFIG.description.max, {
      message: t('formUserErrorMaxLength', {
        max: USER_CONFIG.description.max,
      }),
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
