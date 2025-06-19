import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import user from '@/types/User';
import { USER_CONFIG } from './users.constants';
import { useQuantum } from '@/hooks/useQuantum.hook';

export const useUserForm = () => {
  const { isQuantum, t } = useQuantum('ai-tools/dashboard/users');

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

  const userRoleRules = z.nativeEnum(user.RoleEnum);

  const schema = z.object({
    description: descriptionRules,
    userRole: userRoleRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    description: '',
    userRole: isQuantum
      ? user.RoleEnum.quantum_operator
      : user.RoleEnum.ai_training_operator,
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
