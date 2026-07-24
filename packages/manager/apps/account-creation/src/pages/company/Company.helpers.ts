import { LegalForm } from '@ovh-ux/manager-config';

// INSEE "catégorie juridique" code → account type: 9.* => association,
// 4.* / 7.* / 8110 => administration (B2G), anything else
// (1.*, 2.*, 3.*, 5.*, 6.* …) => corporation.
const LEGAL_FORM_CODE_ASSOCIATION = /^9\d+$/;
const LEGAL_FORM_CODE_ADMINISTRATION = /^(4\d+|7\d+|8110)$/;

export const calculateFRVATNumber = (siren: string): string | null => {
  const parsedSiren = Number.parseInt(siren, 10);
  if (siren.length !== 9 || Number.isNaN(parsedSiren)) {
    return null;
  }
  const checksum = String((12 + 3 * (parsedSiren % 97)) % 97).padStart(2, '0');
  return `FR${checksum}${siren}`;
};

export const getLegalFormFromCode = (code: string): LegalForm => {
  if (LEGAL_FORM_CODE_ASSOCIATION.test(code)) {
    return 'association';
  }
  if (LEGAL_FORM_CODE_ADMINISTRATION.test(code)) {
    return 'administration';
  }
  return 'corporation';
};
