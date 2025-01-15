import z from 'zod';
import { eachDayOfInterval, sub } from 'date-fns';
import {
  CommercialCatalogPricingSchema,
  CommercialCatalogPricingType,
  CommercialCatalogTechnicalSchema,
  CommercialCatalogTechnicalType,
} from '@/types/commercial-catalog.type';
import { convertToDuration, convertToPrice } from '../commercial-catalog/utils';
import { SavingsPlanPeriodConsumption } from '@/types/savingsPlanConsumption.type';

export const formatTechnicalInfo = (
  technicalInfo: CommercialCatalogTechnicalType,
) => {
  try {
    CommercialCatalogTechnicalSchema.parse(technicalInfo);

    return {
      id: technicalInfo.id,
      code: technicalInfo.code,
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

type DayData = {
  day: number;
  included: number;
  excluded: number;
  cumulPlanSize: number;
};

const filterMaxIncludedPerDay = (data: DayData[]): DayData[] => {
  const maxIncludedMap: Record<number, DayData> = {};

  data.forEach((entry) => {
    const existingEntry = maxIncludedMap[entry.day];
    if (!existingEntry || entry.included > existingEntry.included) {
      maxIncludedMap[entry.day] = entry;
    }
  });

  return Object.values(maxIncludedMap);
};

export const getChartsData = (
  periods: SavingsPlanPeriodConsumption[],
): DayData[] =>
  filterMaxIncludedPerDay(
    periods
      .map((period) => {
        const startDate = period.begin;
        const endDate = period.end;
        const computedEndDate = sub(endDate, { minutes: 1 }).toISOString();
        const adjustedEndDate = new Date(computedEndDate);
        adjustedEndDate.setUTCHours(0, 0, 0, 0);

        const consumptionSizeFormatted = period.consumption_size ?? 0;
        const cumulPlanSizeFormatted = period.cumul_plan_size ?? 0;

        const included = Math.min(
          consumptionSizeFormatted,
          cumulPlanSizeFormatted,
        );
        const excluded =
          consumptionSizeFormatted > cumulPlanSizeFormatted
            ? consumptionSizeFormatted - cumulPlanSizeFormatted
            : 0;

        const daysInterval = eachDayOfInterval({
          start: startDate,
          end: adjustedEndDate,
        });

        return daysInterval.map((day) => ({
          day: day.getDate(),
          included,
          excluded,
          cumulPlanSize: cumulPlanSizeFormatted,
        }));
      })
      .flat(),
  );
