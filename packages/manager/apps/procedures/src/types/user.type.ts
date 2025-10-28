export type LegalFrom = 'individual' | 'association' | 'corporation' | 'other' | 'administration';
export type Subsidiary =
  | 'FR'
  | 'DE'
  | 'ES'
  | 'PL'
  | 'IE'
  | 'IT'
  | 'NL'
  | 'PT'
  | 'GB'
  | 'CZ'
  | 'FI'
  | 'LT'
  | 'LTE'
  | 'CA'
  | 'QC'
  | 'WS'
  | 'TN'
  | 'MA'
  | 'SN'
  | 'AU'
  | 'ASIA'
  | 'SG'
  | 'IN'
  | 'WE';

export type User = {
  legalform: LegalFrom;
  email: string;
  language: string;
  subsidiary: Subsidiary;
};
