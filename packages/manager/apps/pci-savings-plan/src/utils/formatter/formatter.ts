import { TechnicalInfo } from '@/types/commercial-catalog.type';
import { CommercialCatalogPricing } from '@/types/commercial-catalog-pricing.type';
import { convertToDuration, convertToPrice } from '../commercial-catalog/utils';

export const formatTechnicalInfo = (technicalInfo: TechnicalInfo) => ({
  name: technicalInfo.legacy.blob.content.technical.name,
  hourlyPrice: convertToPrice(
    technicalInfo.commercialRatingValues[0].ratingValue.priceRatingValue
      .prices[0].amount,
  ),
  technical: technicalInfo.legacy.blob.content.technical,
});

export const formatPricingInfo = (pricingInfo: CommercialCatalogPricing) => ({
  id: pricingInfo.id,
  duration: convertToDuration(pricingInfo.engagements[0].validDuration),
  price: convertToPrice(
    pricingInfo.commercialRatingValues[0].ratingValue.priceRatingValue.prices[0]
      .amount,
  ),
});
