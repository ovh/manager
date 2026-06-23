import { Country, LegalForm } from '@ovh-ux/manager-config';

export const FR_COUNTRIES = ['FR', 'GP', 'MQ', 'GF', 'RE', 'YT'];

export const shouldAccessOrganizationSearch = (
  country?: Country,
  legalForm?: LegalForm,
) =>
  FR_COUNTRIES.includes(country || '') &&
  !!legalForm &&
  legalForm !== 'individual';

export const shouldEnableSIRENDisplay = (
  country?: Country,
  legalForm?: LegalForm,
) => FR_COUNTRIES.includes(country || '') && legalForm === 'corporation';

export const getSirenFromSiret = (
  siret?: string,
  pattern?: string | null,
): string | null => {
  if (!siret || !pattern) return null;

  return new RegExp(pattern).test(siret) ? siret.substring(0, 9) : null;
};

export const isIndividualLegalForm = (legalForm?: LegalForm) =>
  legalForm === 'individual';

export const isUserLoggedIn = () => document.cookie.includes('USERID');
