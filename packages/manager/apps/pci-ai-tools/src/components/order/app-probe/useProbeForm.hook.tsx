import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { APP_CONFIG } from '@/configuration/app';

export const useProbeForm = () => {
  const { t } = useTranslation('ai-tools/components/app-probe');
  const probeSchema = z.object({
    path: z
      .string()
      .trim()
      .min(1)
      .regex(APP_CONFIG.probe.path.pattern, {
        message: t('formPathFormatError'),
      }),
    port: z.coerce
      .number()
      .min(APP_CONFIG.port.min, {
        message: t('formPortMinError', { min: APP_CONFIG.port.min }),
      })
      .max(APP_CONFIG.port.max, {
        message: t('formPortMaxError', { max: APP_CONFIG.port.max }),
      }),
  });

  const form = useForm({
    resolver: zodResolver(probeSchema),
  });

  return { form, probeSchema };
};
