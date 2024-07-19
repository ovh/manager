interface Description {
  defaultLanguage: string;
  originalLanguage: string;
  localDescriptions: LocalDescription[];
}

interface LocalDescription {
  language: string;
  longLabel: string;
  shortLabel: string;
  translationStatus: string;
}

interface Charge {
  processingStrategy: string;
  type: string;
  ratingMode: string;
  atomicCharge: AtomicCharge;
}

interface AtomicCharge {
  chargeType: string;
  consumptionCharge: ConsumptionCharge;
}

interface ConsumptionCharge {
  aggregationPeriod: string;
  aggregationType: string;
  roundingPolicy: string;
}

interface RatingModel {
  charge: Charge;
}

interface Price {
  currencyCode: string;
  amount: number;
}

interface PriceRatingValue {
  prices: Price[];
}

interface RatingValue {
  type: string;
  priceRatingValue: PriceRatingValue;
}

interface CommercialRatingValue {
  chargeId: string;
  ratingValue: RatingValue;
}

interface Validity {
  startDate: string;
  eosDate?: string;
  eolDate?: string;
}

interface Bandwidth {
  guaranteed: boolean;
  level: number;
  unlimited: boolean;
}

interface Cpu {
  cores: number;
  frequency: number;
  model: string;
  type: string;
}

interface Memory {
  size: number;
}

interface Os {
  family: string;
}

interface Disk {
  capacity: number;
  number: number;
  technology: string;
}

interface Storage {
  disks: Disk[];
  raid: string;
}

interface Vrack {
  guaranteed: boolean;
  level: number;
  unlimited: boolean;
}

export interface Technical {
  bandwidth: Bandwidth;
  cpu: Cpu;
  memory: Memory;
  name: string;
  os: Os;
  storage: Storage;
  vrack: Vrack;
}

interface Commercial {
  brick: string;
  brickSubtype: string;
  name: string;
  price: PriceDetails;
}

interface PriceDetails {
  interval: string;
  precision: number;
  unit: string;
}

interface BlobContent {
  commercial: Commercial;
  tags: string[];
  technical: Technical;
}

interface Blob {
  content: BlobContent;
}

interface Catalog {
  id: number;
  name: string;
}

interface Legacy {
  plan: string;
  blob: Blob;
  catalog: Catalog;
}

interface ConfigField {
  name: string;
  type: string;
  mandatory: boolean;
  defaultValue: string;
}

interface CommercialProductDescription {
  defaultLanguage: string;
  originalLanguage: string;
  localDescriptions: LocalDescription[];
}

interface CommercialProduct {
  code: string;
  description: CommercialProductDescription;
  type: string;
  configFields: ConfigField[];
}

interface AtomicOfferCommercialProduct {
  commercialProduct: CommercialProduct;
  min: number;
}

interface AtomicOffer {
  atomicOfferCommercialProduct: AtomicOfferCommercialProduct;
}

export interface TechnicalInfo {
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
  atomicOffer: AtomicOffer;
}
