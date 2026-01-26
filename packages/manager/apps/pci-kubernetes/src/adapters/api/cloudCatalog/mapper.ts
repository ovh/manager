import {
  CatalogPlanDictionnary,
  PLAN_CODES,
  TCloudCatalog,
  TCloudCatalogPlan,
  TCloudCatalogPricing,
  TPlanCode,
} from '@/domain/entities/cloudCatalog';

import {
  TCloudCatalogAddonDTO,
  TCloudCatalogPricingDTO,
  TCloudCatalogResponseDTO,
} from './dto.types';

const mapPricingDtoToPricing = (dto: TCloudCatalogPricingDTO): TCloudCatalogPricing => {
  return {
    phase: dto.phase,
    capacities: dto.capacities,
    commitment: dto.commitment,
    description: dto.description,
    interval: dto.interval,
    intervalUnit: dto.intervalUnit,
    price: dto.price,
    formattedPrice: dto.formattedPrice,
    tax: dto.tax,
    mode: dto.mode,
    strategy: dto.strategy,
    mustBeCompleted: dto.mustBeCompleted,
    type: dto.type,
  };
};

const mapAddonDtoToPlan = (dto: TCloudCatalogAddonDTO): TCloudCatalogPlan => {
  return {
    planCode: dto.planCode,
    invoiceName: dto.invoiceName,
    product: dto.product,
    pricingType: dto.pricingType,
    consumptionConfiguration: dto.consumptionConfiguration
      ? {
          billingStrategy: dto.consumptionConfiguration.billingStrategy,
          prorataUnit: dto.consumptionConfiguration.prorataUnit,
          pingEndPolicy: dto.consumptionConfiguration.pingEndPolicy,
        }
      : null,
    pricings: dto.pricings.map(mapPricingDtoToPricing),
  };
};

export const mapCloudCatalogToEntity = (dto: TCloudCatalogResponseDTO): TCloudCatalog => {
  const mksPlansMap: CatalogPlanDictionnary = {};

  dto.addons.forEach((addon) => {
    if ((PLAN_CODES as ReadonlyArray<string>).includes(addon.planCode)) {
      mksPlansMap[addon.planCode as TPlanCode] = mapAddonDtoToPlan(addon);
    }
  });

  return {
    entities: {
      plans: mksPlansMap,
    },
  };
};
