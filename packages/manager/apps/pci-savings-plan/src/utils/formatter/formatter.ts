import z from 'zod';
import {
  CommercialCatalogPricingSchema,
  CommercialCatalogPricingType,
  CommercialCatalogTechnicalSchema,
  CommercialCatalogTechnicalType,
} from '@/types/commercial-catalog.type';
import { convertToDuration, convertToPrice } from '../commercial-catalog/utils';

export const formatTechnicalInfo = (
  technicalInfo: CommercialCatalogTechnicalType,
) => {
  try {
    CommercialCatalogTechnicalSchema.parse(technicalInfo);

    return {
      id: technicalInfo.id,
      name: technicalInfo.descriptions[0].longLabel,
      hourlyPrice: convertToPrice(
        technicalInfo.commercialRatingValues[0].ratingValue.prices[0].amount,
      ),
      technical: technicalInfo.legacy.blobs.content.technical,
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error(err.issues);
    }
    return {
      id: technicalInfo?.id,
      name: technicalInfo?.descriptions?.[0]?.longLabel,
      hourlyPrice: convertToPrice(
        technicalInfo?.commercialRatingValues?.[0]?.ratingValue?.prices?.[0]
          ?.amount,
      ),
    };
  }
};

export const formatPricingInfo = (
  pricingInfo: CommercialCatalogPricingType,
) => {
  try {
    CommercialCatalogPricingSchema.parse(pricingInfo);

    return {
      id: pricingInfo.id,
      code: pricingInfo.code,
      duration: convertToDuration(pricingInfo.engagements?.[0]?.validDuration),
      price: convertToPrice(
        pricingInfo.commercialRatingValues?.[0]?.ratingValue?.prices?.[0]
          ?.amount,
      ),
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error(err.issues);
    }
    return {};
  }
};
