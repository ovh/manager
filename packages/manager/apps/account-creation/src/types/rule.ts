export type RuleField =
  | 'address'
  | 'area'
  | 'birthCity'
  | 'birthDay'
  | 'city'
  | 'companyNationalIdentificationNumber'
  | 'corporationType'
  | 'country'
  | 'email'
  | 'fax'
  | 'firstname'
  | 'italianSDI'
  | 'language'
  | 'legalform'
  | 'name'
  | 'nationalIdentificationNumber'
  | 'organisation'
  | 'ovhCompany'
  | 'ovhSubsidiary'
  | 'phone'
  | 'phoneCountry'
  | 'phoneType'
  | 'purposeOfPurchase'
  | 'sex'
  | 'spareEmail'
  | 'vat'
  | 'zip';

export type Rule = {
  defaultValue: string | null;
  examples: string[] | null;
  fieldName: RuleField | null;
  in: string[] | null;
  mandatory: boolean;
  maxLength: number | null;
  minLength: number | null;
  prefix: string | null;
  regularExpression: string | null;
};
