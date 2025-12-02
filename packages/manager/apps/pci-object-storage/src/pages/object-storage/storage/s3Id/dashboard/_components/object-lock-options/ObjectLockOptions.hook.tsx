import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StorageLockConfiguration } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { createObjectLockOptionsSchema } from './ObjectLockOptions.schema';
import { fromISO8601 } from '@/lib/iso8601DurationHelper';
import storages from '@/types/Storages';

export const useObjectLockOptionsForm = ({
  currentObjectLockOptions,
}: {
  currentObjectLockOptions: StorageLockConfiguration;
}) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const schema = createObjectLockOptionsSchema(t);
  type ValidationSchema = z.infer<typeof schema>;

  const { value: durationValue, unit: durationUnit } = fromISO8601(
    currentObjectLockOptions?.rule?.period,
  );

  const defaultValues: ValidationSchema = {
    status: currentObjectLockOptions?.status,
    retention: !!currentObjectLockOptions?.rule,
    rule: {
      mode:
        currentObjectLockOptions?.rule?.mode ||
        storages.ObjectLockModeEnum.governance,
      durationValue,
      durationUnit,
    },
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Track if user has interacted with retention toggle
  const hasUserToggledRetention = useRef(false);

  // watchers
  const retention = form.watch('retention');
  form.watch('rule.mode');
  form.watch('rule.durationValue');
  form.watch('rule.durationUnit');

  useEffect(() => {
    // if (!retention) {
    //   form.setValue('rule', undefined, { shouldValidate: true });
    // }

    // Mark that user has interacted if retention changes from initial value
    if (retention !== defaultValues.retention) {
      hasUserToggledRetention.current = true;
    }

    if (hasUserToggledRetention.current) {
      if (!retention) {
        form.setValue('rule', null, { shouldValidate: true });
      } else {
        form.setValue(
          'rule',
          {
            mode: storages.ObjectLockModeEnum.governance,
            durationValue: 1,
            durationUnit: 'Y',
          },
          { shouldValidate: true },
        );
      }
    }
  }, [retention]);

  return { form, schema };
};
