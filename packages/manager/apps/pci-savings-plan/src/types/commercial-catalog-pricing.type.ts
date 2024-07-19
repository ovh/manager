export interface LocalDescription {
  language: string;
  longLabel: string;
  shortLabel: string;
  translationStatus: string;
}

export interface Description {
  defaultLanguage: string;
  originalLanguage: string;
  localDescriptions: LocalDescription[];
}

export interface Engagement {
  validDuration: string;
  autoReactive: boolean;
}

export interface RecurringCharge {
  billFrequency: string;
  prorata: boolean;
}

export interface AtomicCharge {
  chargeType: string;
  recurringCharge: RecurringCharge;
}

export interface Charge {
  processingStrategy: string;
  type: string;
  ratingMode: string;
  engagement: Engagement;
  atomicCharge: AtomicCharge;
}

export interface RatingModel {
  charge: Charge;
}

export interface Price {
  currencyCode: string;
  amount: number;
}

export interface PriceRatingValue {
  prices: Price[];
}

export interface RatingValue {
  type: string;
  priceRatingValue: PriceRatingValue;
}

export interface CommercialRatingValue {
  ratingValue: RatingValue;
}

export interface Validity {
  startDate: string;
}

export interface Catalog {
  id: number;
  name: string;
}

export interface Legacy {
  catalog: Catalog;
}

export interface CompositeProductCommercialProduct {
  commercialProduct: {
    code: string;
    type: string;
  };
}

export interface CompositeProduct {
  compositeProductCommercialProducts: CompositeProductCommercialProduct[];
}

export interface CommercialProductDescription {
  defaultLanguage: string;
  originalLanguage: string;
  localDescriptions: LocalDescription[];
}

export interface CommercialProduct {
  code: string;
  description: CommercialProductDescription;
  type: string;
  compositeProduct: CompositeProduct;
}

export interface AtomicOfferCommercialProduct {
  commercialProduct: CommercialProduct;
}

export interface AtomicOffer {
  atomicOfferCommercialProduct: AtomicOfferCommercialProduct;
}

export interface CommercialCatalogPricing {
  id: string;
  code: string;
  version: number;
  description: Description;
  ratingModels: RatingModel[];
  commercialRatingValues: CommercialRatingValue[];
  archivable: boolean;
  validity: Validity;
  legacy: Legacy;
  type: string;
  nature: string;
  customerVisible: boolean;
  engagements: Engagement[];
  atomicOffer: AtomicOffer;
}
