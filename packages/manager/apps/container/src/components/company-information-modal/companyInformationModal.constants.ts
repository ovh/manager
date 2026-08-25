import { Country } from '@ovh-ux/manager-config';

export const INTERVAL_BETWEEN_DISPLAY_IN_S = 60 * 60;
export const MODAL_NAME = 'CompanyInformationModal';
export const ELECTRONIC_BILLING_REGULATION_LINK = 'https://www.economie.gouv.fr/tout-savoir-sur-la-facturation-electronique-pour-les-entreprises';
export const TRACKING_PREFIX = 'Hub::account::user';
export const TRACKING_CONTEXT = {
  chapter1: 'Hub',
  chapter2: 'account',
  chapter3: 'user',
  level2: 'Manager-Account',
  page: 'user::pop-up::business_verification_required',
};

export const ACCOUNT_TO_REVIEW_CERTIFICATE = 'fr-e-invoicing-account-to-review';
export const E_INVOICING_CERTIFICATES = [
  'fr-e-invoicing-warning',
  'fr-e-invoicing-critical',
  ACCOUNT_TO_REVIEW_CERTIFICATE,
];

// Certificate variants: mainland France and the overseas territories the reform
// reaches.
export const CERTIFICATE_CHECK_COUNTRIES: Country[] = [
  'FR',
  'GP',
  'MQ',
  'RE',
  'GF',
  'YT',
  'BL',
  'PM',
];
// The SIRET check stops at the territories French VAT applies to, since that is
// what an electronic invoice is issued against.
export const SIRET_CHECK_COUNTRIES: Country[] = ['FR', 'GP', 'MQ', 'RE'];
export const SIRET_REGEX = /^\d{14}$/;
// A SIRET is a SIREN (9 digits) followed by a NIC (5).
export const SIREN_LENGTH = 9;
// La Poste: the one SIREN whose SIRETs carry no Luhn checksum.
export const LA_POSTE_SIREN = '356000000';
// Never attributed, and a favourite placeholder.
export const UNASSIGNED_SIREN = '000000000';

// The billing application carries its own, more restrictive modal on the
// invoices page (the billing module's eInvoicingWarning): this one steps aside
// while the customer is in there.
export const INVOICES_APPLICATION_ID = 'billing';

// The wording depends on why the modal shows up (see getContentKeyPrefix).
export const CONTENT_KEY_PREFIX = {
  legacy: 'company_information_modal',
  review: 'company_information_modal_review',
  siret: 'company_information_modal_siret',
};
