import { z } from 'zod';

const EngagementSchema = z.object({
  validDuration: z.string(),
  autoReactive: z.boolean().optional(),
});

const PriceSchema = z.object({
  currencyCode: z.string().optional(),
  amount: z.number(),
});

const RatingValueSchema = z.object({
  type: z.string(),
  prices: z.array(PriceSchema),
});

const CommercialRatingValueSchema = z.object({
  ratingValue: RatingValueSchema,
});

const LegacyTechnicalSchema = z.object({
  plan: z.string(),
  blobs: z.object({
    content: z.object({
      technical: z.object({
        bandwidth: z
          .object({
            guaranteed: z.boolean(),
            level: z.number(),
            unlimited: z.boolean(),
          })
          .optional(),
        cpu: z
          .object({
            cores: z.number(),
            frequency: z.number(),
            model: z.string(),
            type: z.string(),
          })
          .optional(),
        memory: z
          .object({
            size: z.number(),
          })
          .optional(),
        name: z.string().optional(),
        os: z
          .object({
            family: z.string(),
          })
          .optional(),
        storage: z
          .object({
            disks: z.array(
              z.object({
                capacity: z.number(),
                number: z.number(),
                technology: z.string(),
              }),
            ),
            raid: z.string(),
          })
          .optional(),
      }),
    }),
  }),
});

const CommercialCatalogBasic = z.object({
  id: z.string(),
  code: z.string().optional(),
  version: z.number(),
  commercialRatingValues: z.array(CommercialRatingValueSchema),
});

export const CommercialCatalogPricingSchema = CommercialCatalogBasic.extend({
  legacy: z
    .object({
      plan: z.string(),
    })
    .optional(),
  engagements: z.array(EngagementSchema),
});

export const CommercialCatalogTechnicalSchema = CommercialCatalogBasic.extend({
  legacy: LegacyTechnicalSchema,
  descriptions: z.array(
    z.object({
      longLabel: z.string(),
    }),
  ),
});

export type CommercialCatalogPricingType = z.infer<
  typeof CommercialCatalogPricingSchema
>;

export type CommercialCatalogTechnicalType = z.infer<
  typeof CommercialCatalogTechnicalSchema
>;
