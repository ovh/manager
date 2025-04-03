import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { DOCKER_CONFIG } from './docker.constant';

export const useDockerForm = () => {
  const { t } = useTranslation('ai-tools/dashboard/docker');

  const regionRules = z
    .string()
    .trim()
    .min(DOCKER_CONFIG.region.min, {
      message: t('formDockerErrorRegion', {
        min: DOCKER_CONFIG.region.min,
      }),
    });

  const usernameRules = z
    .string()
    .trim()
    .min(DOCKER_CONFIG.other.min, {
      message: t('formDockerErrorMinLength', {
        min: DOCKER_CONFIG.other.min,
      }),
    })
    .regex(DOCKER_CONFIG.name.pattern, {
      message: t('formDockerNameErrorPattern'),
    });

  const passwordRules = z
    .string()
    .trim()
    .min(DOCKER_CONFIG.other.min, {
      message: t('formDockerErrorMinLength', {
        min: DOCKER_CONFIG.other.min,
      }),
    });

  const urlRules = z
    .string()
    .trim()
    .min(DOCKER_CONFIG.other.min, {
      message: t('formDockerErrorMinLength', {
        min: DOCKER_CONFIG.other.min,
      }),
    });

  const schema = z.object({
    region: regionRules,
    username: usernameRules,
    password: passwordRules,
    url: urlRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    region: '',
    username: '',
    password: '',
    url: '',
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
