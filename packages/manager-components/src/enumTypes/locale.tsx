export enum OvhSubsidiary {
  ASIA = 'ASIA',
  AU = 'AU',
  CA = 'CA',
  CZ = 'CZ',
  DE = 'DE',
  ES = 'ES',
  FI = 'FI',
  FR = 'FR',
  GB = 'GB',
  IE = 'IE',
  IN = 'IN',
  IT = 'IT',
  LT = 'LT',
  MA = 'MA',
  NL = 'NL',
  PL = 'PL',
  PT = 'PT',
  QC = 'QC',
  SG = 'SG',
  SN = 'SN',
  TN = 'TN',
  US = 'US',
  WE = 'WE',
  WS = 'WS',
  EU = 'EU',
  DEFAULT = 'DEFAULT',
}

export enum CurrencyCode {
  AUD = 'AUD',
  CAD = 'CAD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR',
  MAD = 'MAD',
  PLN = 'PLN',
  SGD = 'SGD',
  USD = 'USD',
  TND = 'TND',
  XOF = 'XOF',
}

export const OVH_CURRENCY_BY_SUBSIDIARY: Record<OvhSubsidiary, CurrencyCode> = {
  ASIA: CurrencyCode.USD,
  AU: CurrencyCode.AUD,
  CA: CurrencyCode.CAD,
  CZ: CurrencyCode.EUR,
  DE: CurrencyCode.EUR,
  ES: CurrencyCode.EUR,
  FI: CurrencyCode.EUR,
  FR: CurrencyCode.EUR,
  GB: CurrencyCode.GBP,
  IE: CurrencyCode.EUR,
  IN: CurrencyCode.INR,
  IT: CurrencyCode.EUR,
  LT: CurrencyCode.EUR,
  MA: CurrencyCode.MAD,
  NL: CurrencyCode.EUR,
  PL: CurrencyCode.PLN,
  PT: CurrencyCode.EUR,
  QC: CurrencyCode.CAD,
  SG: CurrencyCode.SGD,
  SN: CurrencyCode.XOF,
  TN: CurrencyCode.TND,
  EU: CurrencyCode.EUR,
  US: CurrencyCode.USD,
  WE: CurrencyCode.USD,
  WS: CurrencyCode.USD,
  DEFAULT: CurrencyCode.USD,
};
