import z from 'zod';
import {
  CommercialCatalogPricingSchema,
  CommercialCatalogPricingType,
  CommercialCatalogTechnicalSchema,
  CommercialCatalogTechnicalType,
} from '@/types/commercial-catalog.type';
import { convertToDuration, convertToPrice } from '../commercial-catalog/utils';
import { SavingsPlanService } from '@/types';
import { SavingsPlanConsumption } from '@/types/savingsPlanConsumption.type';

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

export const transformChart = (apiData: SavingsPlanConsumption) => {
  console.log('data:', apiData);

  // Extraction des périodes depuis les "flavors"
  const periods = apiData.flavors.flatMap((flavor) => flavor.periods);

  // Création d'une Map pour stocker les données par jour
  const daysMap = new Map();

  // Fonction pour ajouter la consommation d'un jour donné dans la Map
  const addConsumptionToDay = (day: number, inclus: number, exclus: number) => {
    if (!daysMap.has(day)) {
      daysMap.set(day, { day, inclus: 0, exclus: 0 });
    }

    const currentData = daysMap.get(day);
    daysMap.set(day, {
      day,
      inclus: currentData.inclus + inclus,
      exclus: currentData.exclus + exclus,
    });
  };

  // Traitement des périodes
  periods.forEach(
    ({
      begin,
      end,
      consumption_size: consumptionSize,
      cumul_plan_size: cumulPlanSize,
    }) => {
      const startDate = new Date(begin);
      const endDate = new Date(end);
      const inclus = Math.min(consumptionSize, cumulPlanSize);
      const exclus = consumptionSize - inclus;

      // Ajout des consommations pour chaque jour de la période
      while (startDate <= endDate) {
        addConsumptionToDay(startDate.getDate(), inclus, exclus);
        startDate.setDate(startDate.getDate() + 1);
      }
    },
  );

  // Conversion de la Map en tableau
  return Array.from(daysMap.values());
};
