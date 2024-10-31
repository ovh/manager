import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import * as ai from '@/types/cloud/project/ai';
import { DOCKER_CONFIG } from './docker.constant';

export interface UseDockerFormProps {
  regions: ai.capabilities.Region[];
}

export const useDockerForm = ({ regions }: UseDockerFormProps) => {
  const { t } = useTranslation('pci-ai-dashboard/docker');

  const regionRules = z
    .string()
    .trim()
    .min(DOCKER_CONFIG.region.min, {
      message: t('formDockerErrorMinLength', {
        min: DOCKER_CONFIG.region.min,
      }),
    })
    .max(DOCKER_CONFIG.region.max, {
      message: t('formDockerErrorMaxLength', {
        max: DOCKER_CONFIG.region.max,
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
    region: regions[0].id,
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
