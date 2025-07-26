export type TPrice = {
  value: string; // value formatted with currency (e.g.: 25,50 €)
  unit: string; // needs to include VAT/non-VAT (e.g.: HT/mois)
  isLeastPrice?: boolean;
  descriptions?: string[];
};
