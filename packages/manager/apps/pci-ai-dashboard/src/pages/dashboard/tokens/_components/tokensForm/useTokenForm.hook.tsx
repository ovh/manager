import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { TOKEN_CONFIG } from './token.constant';
import * as ai from '@/types/cloud/project/ai';

export interface UseTokenFormProps {
  regions: ai.capabilities.Region[];
}

export const useTokenForm = ({ regions }: UseTokenFormProps) => {
  const { t } = useTranslation('pci-ai-dashboard/tokens');

  const nameRules = z
    .string()
    .min(TOKEN_CONFIG.name.min, {
      message: t('formTokenErrorMinLength', {
        min: TOKEN_CONFIG.name.min,
      }),
    })
    .max(TOKEN_CONFIG.name.max, {
      message: t('formTokenErrorMaxLength', {
        max: TOKEN_CONFIG.name.max,
      }),
    })
    .regex(TOKEN_CONFIG.name.pattern, {
      message: t('formTokenNameErrorPattern'),
    });

  const labelSelectorRules = z
    .string()
    .max(TOKEN_CONFIG.name.max, {
      message: t('formTokenErrorMaxLength', {
        max: TOKEN_CONFIG.label.max,
      }),
    })
    .regex(TOKEN_CONFIG.label.pattern, {
      message: t('formTokenLabelErrorPattern'),
    })
    .optional()
    .or(z.literal(''));

  const roleRules = z.nativeEnum(ai.TokenRoleEnum);

  const regionRules = z
    .string()
    .min(TOKEN_CONFIG.region.min, {
      message: t('formTokenErrorMinLength', {
        min: TOKEN_CONFIG.region.min,
      }),
    })
    .max(TOKEN_CONFIG.region.max, {
      message: t('formTokenErrorMaxLength', {
        max: TOKEN_CONFIG.region.max,
      }),
    });

  const schema = z.object({
    name: nameRules,
    label: labelSelectorRules,
    role: roleRules,
    region: regionRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    name: '',
    label: '',
    role: ai.TokenRoleEnum.ai_training_operator,
    region: regions[0].id,
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
