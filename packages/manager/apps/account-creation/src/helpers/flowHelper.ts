import { Country, LegalForm } from '@ovh-ux/manager-config';

export const shouldAccessOrganizationSearch = (
  country?: Country,
  legalForm?: LegalForm,
) => country === 'FR' && !!legalForm && legalForm !== 'individual';

export const shouldEnableSIRENDisplay = (
  country?: Country,
  legalForm?: LegalForm,
) => country === 'FR' && legalForm === 'corporation';

export const getSirenFromSiret = (
  siret?: string,
  pattern?: string | null,
): string | null => {
  if (!siret || !pattern) return null;

  return new RegExp(pattern).test(siret) ? siret.substring(0, 9) : null;
};

export const isIndividualLegalForm = (legalForm?: LegalForm) =>
  legalForm === 'individual';
