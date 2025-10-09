import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export interface UseLabelFormProps {
  configuredLabel: string[];
}
export const useLabelForm = ({ configuredLabel }: UseLabelFormProps) => {
  const { t } = useTranslation('components/labels');
  const labelSchema = z.object({
    key: z
      .string()
      .trim()
      .min(1)
      .max(15)
      .refine(
        (newKey) =>
          !configuredLabel?.some(
            (existingLabel) =>
              existingLabel.toLowerCase() === newKey.toLowerCase(),
          ),
        {
          message: t('existingKeyError'),
        },
      ),
    value: z
      .string()
      .trim()
      .min(1)
      .max(15),
  });

  const form = useForm({
    resolver: zodResolver(labelSchema),
  });

  return { form, labelSchema };
};
