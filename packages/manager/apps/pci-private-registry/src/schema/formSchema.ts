import * as z from 'zod';
import { FilterRestrictionsEnum } from '@/types';

export const schemaAddCidr = (dataCIDR: string[], isUpdating: boolean) =>
  z.object({
    description: z.string().optional(),
    ipBlock: z
      .string()
      .trim()
      .transform((value) => {
        try {
          z.string()
            .cidr()
            .parse(value);
        } catch (err) {
          return `${value}/32`;
        }
        return value;
      })
      .superRefine((value, ctx) => {
        try {
          z.string()
            .cidr()
            .parse(value);
        } catch (err) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'private_registry_cidr_validation_ipBlock',
          });
        }
        if (!isUpdating) {
          // verify duplication cidr
          const existingIpBlocks = dataCIDR.map((item) => item);
          if (existingIpBlocks.includes(value)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'private_registry_cidr_already_exist',
            });
          }
        }
      }),
    authorization: z
      .array(
        z.enum([
          FilterRestrictionsEnum.MANAGEMENT,
          FilterRestrictionsEnum.REGISTRY,
        ]),
      )
      .default([])
      .refine((auth) => auth.length > 0, {
        message: 'private_registry_cidr_validation_authorization',
      }),
  });

export const confirmIAMSchema = () =>
  z.object({ confirmIAM: z.literal('CONFIRM') });
