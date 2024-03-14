import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { database } from '@/models/database';
import { NAMESPACES_CONFIG } from './namespace.const';
import {
  durationISOStringToShortTime,
  // durationStringToDuration,
  // durationToISODurationString,
} from '@/lib/durationHelper';
// import { toSeconds } from 'duration-fns';

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

  const mandatoryShortTimeRules = z
    .string()
    .min(NAMESPACES_CONFIG.name.min, {
      message: t('formNamespaceErrorMinLength', {
        min: NAMESPACES_CONFIG.name.min,
      }),
    })
    .max(NAMESPACES_CONFIG.shortTime.max, {
      message: t('formNamespaceErrorMaxLength'),
    })
    .regex(NAMESPACES_CONFIG.shortTime.pattern, {
      message: t('formNamespaceShortTimeErrorPattern'),
    });

  const optionalShortTimeRules = mandatoryShortTimeRules.optional();

  const typeRules = z.nativeEnum(database.m3db.namespace.TypeEnum);

  const schema = z.object({
    name: nameRules,
    resolution: mandatoryShortTimeRules,
    blockDataExpirationDuration: optionalShortTimeRules,
    blockSizeDuration: optionalShortTimeRules,
    bufferFutureDuration: optionalShortTimeRules,
    bufferPastDuration: optionalShortTimeRules,
    periodDuration: mandatoryShortTimeRules,
    snapshotEnabled: z.boolean().optional(),
    type: typeRules,
    writesToCommitLogEnabled: z.boolean().optional(),
  });
  /*
    .superRefine((values, context) => {
      if (values.periodDuration && values.resolution) {
        if (
          toSeconds(
            durationToISODurationString(
              durationStringToDuration(values.periodDuration),
            ),
          ) <
          toSeconds(
            durationToISODurationString(
              durationStringToDuration(values.resolution),
            ),
          )
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('formNamespaceDurationResolutionErrorPattern'),
            path: ['periodDuration'],
          });
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('formNamespaceDurationResolutionErrorPattern'),
            path: ['resolution'],
          });
        }
      }
      if (values.periodDuration && values.blockSizeDuration) {
        if (
          toSeconds(
            durationToISODurationString(
              durationStringToDuration(values.periodDuration),
            ),
          ) <
          toSeconds(
            durationToISODurationString(
              durationStringToDuration(values.blockSizeDuration),
            ),
          )
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('formNamespaceDurationBlockSizeErrorPattern'),
            path: ['periodDuration'],
          });
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('formNamespaceDurationBlockSizeErrorPattern'),
            path: ['blockSizeDuration'],
          });
        }
      }
    }); */

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
