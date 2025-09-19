import { Currency } from '@ovh-ux/manager-config';

type SettingsCompany = {
  country: string;
  name: string;
};

type Brand = {
  name: string;
};

export type SupportLanguage =
  | 'fr-FR'
  | 'es-ES'
  | 'en-IE'
  | 'pt-PT'
  | 'de-DE'
  | 'nl-NL'
  | 'fr-SN'
  | 'it-IT'
  | 'en-GB'
  | 'ar-MA'
  | 'pl-PL'
  | 'fr-TN'
  | 'en-CA'
  | 'en-AU'
  | 'en-SG'
  | 'zh-SG'
  | 'fr-CA'
  | 'hi-IN'
  | 'en-IN'
  | 'en-US';

export type BillingCountry = {
  allowedResidentialCountries: string[];
  brand: Brand;
  company: SettingsCompany;
  country: string;
  currency: Currency;
  ietfLanguageTag: SupportLanguage;
  language: string;
  ovhSubsidiary: string;
};

export type Setting = {
  alpha2Code: string;
  alpha3Code: string;
  billingCountries: BillingCountry[];
  name: string;
};
