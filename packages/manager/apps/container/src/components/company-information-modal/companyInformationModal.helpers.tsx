import { getMe } from "@/data/api/me";
import { User } from "@ovh-ux/manager-config";
import { useQuery } from "@tanstack/react-query";
import {
  ACCOUNT_TO_REVIEW_CERTIFICATE,
  CERTIFICATE_CHECK_COUNTRIES,
  CONTENT_KEY_PREFIX,
  E_INVOICING_CERTIFICATES,
  INVOICES_APPLICATION_ID,
  LA_POSTE_SIREN,
  SIREN_LENGTH,
  SIRET_CHECK_COUNTRIES,
  SIRET_REGEX,
  UNASSIGNED_SIREN,
} from "./companyInformationModal.constants";

export const useBusinessVerificationRequired = (enabled: boolean) => useQuery({
  queryKey: ['me', 'business-verification-required'],
  queryFn: getMe,
  select: (data) => data.businessVerificationRequired ?? false,
  enabled,
});

const isLuhnValid = (digits: string) =>
  digits
    .split('')
    .reverse()
    .reduce((total, digit, index) => {
      const value = index % 2 ? Number(digit) * 2 : Number(digit);
      return total + (value > 9 ? value - 9 : value);
    }, 0) %
    10 ===
  0;

const sumOfDigits = (digits: string) =>
  digits.split('').reduce((total, digit) => total + Number(digit), 0);

// A SIRET is 14 digits: a SIREN and its NIC. Both the SIREN alone and the 14
// digits as a whole carry a Luhn checksum, and since the two double different
// positions, passing one says nothing about the other: check both.
export const isSiretValid = (siret?: string) => {
  if (!siret || !SIRET_REGEX.test(siret)) {
    return false;
  }
  const siren = siret.slice(0, SIREN_LENGTH);
  // Luhn cannot catch a zeroed SIREN: its digits add up to 0, which is a
  // multiple of 10. It is never attributed, so turn it away on its own.
  if (siren === UNASSIGNED_SIREN) {
    return false;
  }
  if (!isLuhnValid(siren)) {
    return false;
  }
  // La Poste is the documented exception: no Luhn on its SIRETs, their digits
  // add up to a multiple of 5 instead. Accept either rather than hold a real
  // customer's invoices back on a checksum they were never meant to carry.
  if (siret.startsWith(LA_POSTE_SIREN)) {
    return sumOfDigits(siret) % 5 === 0 || isLuhnValid(siret);
  }
  return isLuhnValid(siret);
};

// The container gives each application the first path segment after its base
// (see core/routing/iframe-app-router): '/manager/billing/#/history' in
// production, '/billing/#/history' in development. Comparing that segment
// beats comparing whole URLs, which differ between the two.
export const isOnInvoicesApplication = (
  applications: Record<string, { container?: { path?: string } }>,
) => {
  const path =
    applications?.[INVOICES_APPLICATION_ID]?.container?.path ||
    INVOICES_APPLICATION_ID;
  const { pathname } = new URL(window.location.href);
  return pathname.replace(/\/+$/, '').endsWith(`/${path}`);
};

const hasEInvoicingCertificate = (user: User) =>
  E_INVOICING_CERTIFICATES.some((certificate) =>
    user.certificates?.includes(certificate),
  );

// Companies the API flagged with an e-invoicing certificate.
const isConcernedByCertificate = (user: User) =>
  user.legalform === 'corporation' &&
  CERTIFICATE_CHECK_COUNTRIES.includes(user.country) &&
  hasEInvoicingCertificate(user);

// Certificate-free audience: companies whose SIRET is missing or malformed —
// nothing to bill electronically with, so they have to fill it in. Narrower
// than the certificates on countries, same legal form.
export const isConcernedByInvalidSiret = (user: User) =>
  user.legalform === 'corporation' &&
  SIRET_CHECK_COUNTRIES.includes(user.country) &&
  !isSiretValid(user.companyNationalIdentificationNumber);

export const isUserConcernedByBusinessVerification = (user: User) =>
  isConcernedByCertificate(user) || isConcernedByInvalidSiret(user);

// The modal content depends on why it shows up, a certificate always taking
// precedence over the SIRET check:
// - fr-e-invoicing-account-to-review => "review" content
// - fr-e-invoicing-warning / fr-e-invoicing-critical => legacy content
// - no certificate at all (invalid SIRET only) => "siret" content
export const getContentKeyPrefix = (user: User) => {
  if (user.certificates?.includes(ACCOUNT_TO_REVIEW_CERTIFICATE)) {
    return CONTENT_KEY_PREFIX.review;
  }
  if (hasEInvoicingCertificate(user)) {
    return CONTENT_KEY_PREFIX.legacy;
  }
  return CONTENT_KEY_PREFIX.siret;
};
