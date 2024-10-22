import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as database from '@/types/cloud/project/database';
import { NAMESPACES_CONFIG } from './namespace.constants';
import {
  durationISOStringToShortTime,
  durationStringToSeconds,
} from '@/lib/durationHelper';

export interface UseNamespaceFormProps {
  existingNamespaces: database.m3db.Namespace[];
  editedNamespace?: database.m3db.Namespace;
}
export const useNamespaceForm = ({
  existingNamespaces,
  editedNamespace,
}: UseNamespaceFormProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/namespaces',
  );

  const usedNames = existingNamespaces
    .filter((c) => c.name !== editedNamespace?.name)
    .map((cp) => cp.name);

  const nameRules = z
    .string()
    .min(NAMESPACES_CONFIG.name.min, {
      message: t('formNamespaceErrorMinLength', {
        min: NAMESPACES_CONFIG.name.min,
      }),
    })
    .max(NAMESPACES_CONFIG.name.max, {
      message: t('formNamespaceErrorMaxLength', {
        max: NAMESPACES_CONFIG.name.max,
      }),
    })
    .regex(NAMESPACES_CONFIG.name.pattern, {
      message: t('formNamespaceNameErrorPattern'),
    })
    .refine((value) => !usedNames.includes(value), {
      message: t('formNamespaceNameErrorDuplicate'),
    });

  const shortTimeRules = z
    .string()
    .max(NAMESPACES_CONFIG.shortTime.max, {
      message: t('formNamespaceErrorMaxLength'),
    })
    .regex(NAMESPACES_CONFIG.shortTime.pattern, {
      message: t('formNamespaceShortTimeErrorPattern'),
    });

  const optionalShortTimeRules = shortTimeRules.optional();
  const mandatoryShortTimeRules = shortTimeRules.min(
    NAMESPACES_CONFIG.name.min,
    {
      message: t('formNamespaceErrorMinLength', {
        min: NAMESPACES_CONFIG.name.min,
      }),
    },
  );

  const typeRules = z.nativeEnum(database.m3db.namespace.TypeEnum);

  const schema = z
    .object({
      name: nameRules,
      periodDuration: mandatoryShortTimeRules,
      resolution: optionalShortTimeRules,
      blockDataExpirationDuration: optionalShortTimeRules,
      blockSizeDuration: optionalShortTimeRules,
      bufferFutureDuration: optionalShortTimeRules,
      bufferPastDuration: optionalShortTimeRules,
      snapshotEnabled: z.boolean().optional(),
      type: typeRules,
      writesToCommitLogEnabled: z.boolean().optional(),
    })
    .superRefine((values, context) => {
      if (
        values.type === database.m3db.namespace.TypeEnum.aggregated &&
        !values.resolution
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('formNamespaceErrorMinLength', {
            min: NAMESPACES_CONFIG.name.min,
          }),
          path: ['resolution'],
        });
      }
      if (
        values.type === database.m3db.namespace.TypeEnum.aggregated &&
        durationStringToSeconds(values.periodDuration) <
          durationStringToSeconds(values.resolution)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('formNamespaceDurationResolutionErrorPattern'),
          path: ['resolution'],
        });
      }
    });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    name: editedNamespace?.name || '',
    resolution: durationISOStringToShortTime(editedNamespace?.resolution) || '',
    blockDataExpirationDuration:
      durationISOStringToShortTime(
        editedNamespace?.retention.blockDataExpirationDuration,
      ) || '',
    blockSizeDuration:
      durationISOStringToShortTime(
        editedNamespace?.retention.blockSizeDuration,
      ) || '',
    bufferFutureDuration:
      durationISOStringToShortTime(
        editedNamespace?.retention.bufferFutureDuration,
      ) || '',
    bufferPastDuration:
      durationISOStringToShortTime(
        editedNamespace?.retention.bufferPastDuration,
      ) || '',
    periodDuration:
      durationISOStringToShortTime(editedNamespace?.retention.periodDuration) ||
      '',
    snapshotEnabled: editedNamespace?.snapshotEnabled || false,
    type: editedNamespace?.type || database.m3db.namespace.TypeEnum.aggregated,
    writesToCommitLogEnabled:
      editedNamespace?.writesToCommitLogEnabled || false,
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
