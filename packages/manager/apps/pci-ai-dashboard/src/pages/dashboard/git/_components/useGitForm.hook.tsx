import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import * as ai from '@/types/cloud/project/ai';
import { GIT_CONFIG } from './git.constant';

export interface UseGitFormProps {
  regions: ai.capabilities.Region[];
}

export const useGitForm = ({ regions }: UseGitFormProps) => {
  const { t } = useTranslation('pci-ai-dashboard/git');

  const globalRules = z
    .string()
    .min(GIT_CONFIG.other.min, {
      message: t('formGitErrorMinLength', {
        min: GIT_CONFIG.other.min,
      }),
    })
    .max(GIT_CONFIG.other.max, {
      message: t('formGitErrorMaxLength', {
        max: GIT_CONFIG.other.max,
      }),
    });

  const regionRules = z
    .string()
    .min(GIT_CONFIG.region.min, {
      message: t('formGitErrorMinLength', {
        min: GIT_CONFIG.region.min,
      }),
    })
    .max(GIT_CONFIG.region.max, {
      message: t('formGitErrorMaxLength', {
        max: GIT_CONFIG.region.max,
      }),
    });

  const optionalRules = z
    .string()
    .max(GIT_CONFIG.other.max, {
      message: t('formGitErrorMaxLength', {
        max: GIT_CONFIG.other.max,
      }),
    })
    .optional();

  const sshKeyRules = z
    .string()
    .max(GIT_CONFIG.key.max, {
      message: t('formGitErrorMaxLength', {
        max: GIT_CONFIG.key.max,
      }),
    })
    .optional();

  const schema = z
    .object({
      credentialsType: z.enum(['basicAuth', 'sshKeypair']),
      alias: globalRules,
      endpoint: globalRules,
      region: regionRules,
      password: optionalRules,
      username: optionalRules,
      privateKey: sshKeyRules,
      publicKey: sshKeyRules,
    })
    .superRefine((values, context) => {
      if (values.credentialsType === 'basicAuth') {
        if (values.username === '') {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('formGitErrorMandatoryField'),
            path: ['username'],
          });
        } else if (values.password === '') {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('formGitErrorMandatoryField'),
            path: ['password'],
          });
        }
      } else if (values.publicKey === '') {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('formGitErrorMandatoryField'),
          path: ['publicKey'],
        });
      } else if (values.privateKey === '') {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('formGitErrorMandatoryField'),
          path: ['privateKey'],
        });
      }
    });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    region: regions[0].id,
    credentialsType: 'basicAuth',
    alias: '',
    endpoint: '',
    password: '',
    username: '',
    privateKey: '',
    publicKey: '',
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
