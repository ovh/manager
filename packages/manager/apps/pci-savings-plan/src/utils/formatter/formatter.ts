import z from 'zod';
import {
  CommercialCatalogPricingSchema,
  CommercialCatalogPricingType,
  CommercialCatalogTechnicalSchema,
  CommercialCatalogTechnicalType,
} from '@/types/commercial-catalog.type';
import { convertToDuration, convertToPrice } from '../commercial-catalog/utils';
import { SavingsPlanService } from '@/types';

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

export const transformData = (apiData: any) => {
  const periods = apiData.flavors.flatMap((flavor: any) => flavor.periods);

  const daysMap = new Map();

  periods.forEach(({ begin, end, consumption_size, cumul_plan_size }) => {
    const startDate = new Date(begin);
    const endDate = new Date(end);

    while (startDate <= endDate) {
      const day = startDate.getDate();
      const inclus = Math.min(consumption_size, cumul_plan_size);
      const exclus = consumption_size - inclus;

      if (!daysMap.has(day)) {
        daysMap.set(day, { day, inclus: 0, exclus: 0 });
      }

      const currentData = daysMap.get(day);
      daysMap.set(day, {
        day,
        inclus: currentData.inclus + inclus,
        exclus: currentData.exclus + exclus,
      });

      startDate.setDate(startDate.getDate() + 1);
    }
  });

  return Array.from(daysMap.values());
};
