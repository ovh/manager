import { Country, Subsidiary, UserLocales } from '../../locale';
import { LegalForm } from './legalForm';

export interface Currency {
  symbol: string;
  code: string;
  format: string;
}

export interface SupportLevel {
  level: string;
}

export interface Auth {
  account: string;
  allowedRoutes: {
    method: 'GET' | 'PUT' | 'POST' | 'DELETE';
    path: string;
  }[];
  description?: string;
  identities: string[];
  method: string;
  roles: string[];
  user?: string;
}

export interface User {
  phoneCountry: Country | null;
  birthDay: string;
  phone: string;
  nichandle: string;
  email: string;
  legalform: LegalForm;
  language: UserLocales | null;
  area: string;
  state: string;
  currency: Currency;
  organisation: string;
  sex: string;
  customerCode: string;
  name: string;
  nationalIdentificationNumber: string;
  vat: string;
  firstname: string;
  city: string;
  ovhSubsidiary: Subsidiary;
  country: Country;
  fax: string;
  corporationType: string;
  ovhCompany: string;
  companyNationalIdentificationNumber: string;
  zip: string;
  birthCity: string;
  address: string;
  spareEmail: string;
  italianSDI: string;
  supportLevel: SupportLevel;
  certificates: string[];
  auth: Auth;
  isTrusted: boolean;
  enterprise: boolean;
  kycValidated: boolean;
}
