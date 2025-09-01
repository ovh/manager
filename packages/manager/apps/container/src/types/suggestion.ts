export type Suggestion = {
  type: 'COMPANY NUMBER' | 'DUNS' | 'NIN' | 'SIREN' | 'SIRET' | 'VAT';
  id: string;
  isActive: boolean;
};
