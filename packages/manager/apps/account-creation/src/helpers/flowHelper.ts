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

/**
 * TR: the MERSİS No is 16 digits, of which the first 10 are the company's VAT
 * number (VKN, labelled "KDV" on the form).
 */
const MERSIS_NO_PATTERN = /^\d{16}$/;
const MERSIS_NO_VAT_LENGTH = 10;

export const getVatFromMersisNo = (mersisNo: string): string | null =>
  MERSIS_NO_PATTERN.test(mersisNo)
    ? mersisNo.slice(0, MERSIS_NO_VAT_LENGTH)
    : null;

/**
 * Countries whose VAT number is contained in the company national
 * identification number. Countries missing from this map keep a free VAT
 * field: nothing is derived and nothing is checked.
 */
const COUNTRIES_VAT_FROM_CNIN: Record<
  string,
  (cnin: string) => string | null
> = {
  TR: getVatFromMersisNo,
};

export const shouldDeriveVatFromCnin = (country?: string): boolean =>
  Boolean(country && country in COUNTRIES_VAT_FROM_CNIN);

/**
 * The VAT number the country derives from the company national identification
 * number, to prefill the VAT field with once the customer states they have
 * one. null while the identifier is incomplete — the customer is still typing
 * — or for a country that derives nothing.
 */
export const getVatFromCnin = (
  country?: string,
  cnin?: string,
): string | null => {
  const derive = country ? COUNTRIES_VAT_FROM_CNIN[country] : undefined;
  return derive && cnin ? derive(cnin.replace(/\s/g, '')) : null;
};

/**
 * Rejects a VAT number that contradicts the company national identification
 * number it should have been derived from — the customer edited the prefilled
 * value. Everything else is left to /newAccount/rules: an empty VAT number,
 * a country that derives none, or an identifier not complete enough to derive
 * from.
 */
export const isVatConsistentWithCnin = (
  country?: string,
  vat?: string,
  cnin?: string,
): boolean => {
  const derivedVat = getVatFromCnin(country, cnin);
  if (!derivedVat || !vat) {
    return true;
  }
  return vat.replace(/\s/g, '') === derivedVat;
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
