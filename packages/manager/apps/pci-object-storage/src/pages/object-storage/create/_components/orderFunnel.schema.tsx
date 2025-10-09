import { z } from 'zod';
import i18next from 'i18next';
import { ObjectContainerOffers } from './orderFunnel.const';
import storages from '@/types/Storages';

export const createOrderFunnelFormSchema = (t: typeof i18next.t) => {
  const baseSchema = z.object({
    offer: z.nativeEnum(ObjectContainerOffers),
    name: z
      .string()
      .min(3, t('nameInputMinLengthError', { min: 3 }))
      .max(63, t('nameInputMaxLengthError', { max: 63 }))
      .regex(/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/, t('nameInputRegexError')),
    region: z.string().min(1, t('regionRequired')),
    user: z.number().optional(),
  });

  const replicationSchema = z
    .object({
      enabled: z.boolean(),
      automaticRegionSelection: z.boolean(),
      region: z.string().optional(),
    })
    .refine(
      (val) => {
        if (val.enabled && !val.automaticRegionSelection) {
          return !!val.region;
        }
        return true;
      },
      {
        message: t('replicationRegionRequired'),
      },
    );

  const s3Schema = baseSchema.extend({
    offer: z.literal(ObjectContainerOffers['s3-standard']),
    encryption: z.nativeEnum(storages.EncryptionAlgorithmEnum).optional(),
    replication: replicationSchema,
    versioning: z.nativeEnum(storages.VersioningStatusEnum).optional(),
  });

  const swiftSchema = baseSchema.extend({
    offer: z.literal(ObjectContainerOffers.swift),
    archive: z.boolean().default(false),
    containerType: z.nativeEnum(storages.TypeEnum).optional(),
  });

  return z.discriminatedUnion('offer', [s3Schema, swiftSchema]);
};

export type OrderFunnelFormValues = z.infer<
  ReturnType<typeof createOrderFunnelFormSchema>
>;
