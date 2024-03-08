import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { database } from '@/models/database';
import { POOL_CONFIG } from './connectionPool.const';

export interface UseConnectionPoolFormProps {
  existingConnectionPools?: database.postgresql.ConnectionPool[];
  editedConnectionPool?: database.postgresql.ConnectionPool;
}
export const useConnectionPoolForm = ({
  existingConnectionPools,
  editedConnectionPool,
}: UseConnectionPoolFormProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );

  const usedNames = editedConnectionPool
    ? []
    : existingConnectionPools.map((cp) => cp.name);

  const nameRules = z
    .string()
    .min(POOL_CONFIG.name.min, {
      message: t('formConnectionPoolErrorMinLength', {
        min: POOL_CONFIG.name.min,
      }),
    })
    .max(POOL_CONFIG.name.max, {
      message: t('formConnectionPoolErrorMaxLength', {
        max: POOL_CONFIG.name.max,
      }),
    })
    .regex(POOL_CONFIG.name.pattern, {
      message: t('formConnectionPoolNameErrorPattern'),
    })
    .refine((value) => !usedNames.includes(value), {
      message: t('formConnectionPoolNameErrorDuplicate'),
    });

  const databaseRules = z.string();

  const modeRules = z.nativeEnum(database.postgresql.connectionpool.ModeEnum);

  const sizeRules = z
    .number()
    .min(POOL_CONFIG.size.min, {
      message: t('formConnectionPoolErrorMinSizeLength', {
        min: POOL_CONFIG.size.min,
      }),
    })
    .max(POOL_CONFIG.size.max, {
      message: t('formConnectionPoolErrorMaxSizeLength', {
        max: POOL_CONFIG.size.max,
      }),
    });

  const userRules = z.string().optional();

  const schema = z.object({
    name: nameRules,
    databaseId: databaseRules,
    mode: modeRules,
    size: sizeRules,
    userId: userRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = editedConnectionPool
    ? {
        name: editedConnectionPool.name,
        databaseId: editedConnectionPool.databaseId,
        mode: editedConnectionPool.mode,
        size: editedConnectionPool.size,
        userId: editedConnectionPool.userId || '-',
      }
    : {
        name: '',
        databaseId: '',
        mode: database.postgresql.connectionpool.ModeEnum.session,
        size: 1,
        userId: '',
      };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
