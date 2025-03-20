import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { DATASTORE_CONFIG } from './datastore.constant';

export const useDatastoreForm = () => {
  const { t } = useTranslation('ai-tools/dashboard/datastores');

  const aliasRules = z
    .string()
    .trim()
    .min(DATASTORE_CONFIG.other.min, {
      message: t('formDatastoreErrorMinLength', {
        min: DATASTORE_CONFIG.other.min,
      }),
    })
    .max(DATASTORE_CONFIG.other.max, {
      message: t('formDatastoreErrorMaxLength', {
        max: DATASTORE_CONFIG.other.max,
      }),
    })
    .regex(DATASTORE_CONFIG.name.pattern, {
      message: t('formDatastoreNameErrorPattern'),
    });

  const enpointRules = z
    .string()
    .trim()
    .min(DATASTORE_CONFIG.other.min, {
      message: t('formDatastoreErrorMinLength', {
        min: DATASTORE_CONFIG.other.min,
      }),
    })
    .max(DATASTORE_CONFIG.other.max, {
      message: t('formDatastoreErrorMaxLength', {
        max: DATASTORE_CONFIG.other.max,
      }),
    });

  const regionRules = z
    .string()
    .trim()
    .min(DATASTORE_CONFIG.region.min, {
      message: t('formDatastoreErrorRegion', {
        min: DATASTORE_CONFIG.region.min,
      }),
    });

  const s3RegionRules = z
    .string()
    .trim()
    .min(DATASTORE_CONFIG.other.min, {
      message: t('formDatastoreErrorMinLength', {
        min: DATASTORE_CONFIG.other.min,
      }),
    })
    .max(DATASTORE_CONFIG.other.max, {
      message: t('formDatastoreErrorMaxLength', {
        max: DATASTORE_CONFIG.other.max,
      }),
    });

  const s3AccessKeyRules = z
    .string()
    .trim()
    .min(DATASTORE_CONFIG.key.min, {
      message: t('formDatastoreErrorMinLength', {
        min: DATASTORE_CONFIG.key.min,
      }),
    })
    .max(DATASTORE_CONFIG.key.max, {
      message: t('formDatastoreErrorMaxLength', {
        max: DATASTORE_CONFIG.key.max,
      }),
    });

  const s3SecretKeyRules = z
    .string()
    .trim()
    .min(DATASTORE_CONFIG.key.min, {
      message: t('formDatastoreErrorMinLength', {
        min: DATASTORE_CONFIG.key.min,
      }),
    })
    .max(DATASTORE_CONFIG.key.max, {
      message: t('formDatastoreErrorMaxLength', {
        max: DATASTORE_CONFIG.key.max,
      }),
    });

  const schema = z.object({
    alias: aliasRules,
    endpoint: enpointRules,
    region: regionRules,
    s3Region: s3RegionRules,
    s3AccessKey: s3AccessKeyRules,
    s3SecretKey: s3SecretKeyRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    region: '',
    alias: '',
    endpoint: '',
    s3Region: '',
    s3AccessKey: '',
    s3SecretKey: '',
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
