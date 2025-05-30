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
  phoneCountry: string;
  birthDay: string;
  phone: string;
  nichandle: string;
  email: string;
  legalform: string;
  language: string;
  area: string;
  state: string;
  currency: Currency;
  organisation: string;
  sex: string;
  customerCode: string;
  name: string;
  nationalIdentificationNumber: number;
  vat: string;
  firstname: string;
  city: string;
  ovhSubsidiary: string;
  country: string;
  fax: string;
  corporationType: string;
  ovhCompany: string;
  companyNationalIdentificationNumber: number;
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
