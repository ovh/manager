export interface User {
  phone: string;
  address: string;
  email: string;
  phoneCountry: string;
  vat: string;
  country: string;
  spareEmail: string;
  birthCity: string;
  companyNationalIdentificationNumber: null;
  legalform: string;
  birthDay: string;
  organisation: string;
  firstname: string;
  corporationType: string;
  language: string;
  sex: string;
  customerCode: string;
  ovhCompany: string;
  name: string;
  state: string;
  nationalIdentificationNumber: null;
  city: string;
  italianSDI: string;
  fax: string;
  area: string;
  ovhSubsidiary: string;
  nichandle: string;
  zip: string;
  currency: Currency;
}

export interface Currency {
  symbol: string;
  code: string;
  format: string;
}
