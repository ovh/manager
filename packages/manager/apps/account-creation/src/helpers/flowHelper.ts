import { Country, LegalForm } from '@ovh-ux/manager-config';

export const shouldAccessCompanySearch = (
  country?: Country,
  legalForm?: LegalForm,
) => country === 'FR' && legalForm && legalForm !== 'individual';

export const getSirenFromSiret = (
  siret?: string,
  pattern?: string | null,
): string | null => {
  if (!siret || !pattern) return null;

  return new RegExp(pattern).test(siret) ? siret.substring(0, 9) : null;
};
