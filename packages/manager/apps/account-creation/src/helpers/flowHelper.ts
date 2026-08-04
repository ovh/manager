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

// B2G = administration; B2B = corporation / association
export const isB2GLegalForm = (legalForm?: LegalForm) =>
  legalForm === 'administration';

/**
 * A country is unusable for the account creation flow when it is missing or the
 * `UNKNOWN` sentinel returned by the API. Centralised here because the recovery
 * logic (provider, settings, CountryRecoveryModal) must stay in sync.
 */
export const isUnknownCountry = (country?: string): boolean =>
  !country || country === 'UNKNOWN';

export const isUserLoggedIn = () => document.cookie.includes('USERID');
