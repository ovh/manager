// Reuse the shared "tout savoir sur la facturation électronique" documentation
// link declared for the company information modal so both e-invoicing modals point
// to the same official page.
export { ELECTRONIC_BILLING_REGULATION_LINK } from '../company-information-modal/companyInformationModal.constants';

export const MODAL_NAME = 'OtherCategoryModal';
// Mainland France and the overseas departments: the customers bound by the
// French e-invoicing reform.
export const FR_TERRITORIES = ['FR', 'GP', 'MQ', 'GF', 'RE', 'YT'];
export const E_INVOICING_DESCRIPTION_KEY = 'other_category_modal_description';
export const GENERIC_DESCRIPTION_KEY = 'other_category_modal_description_generic';
// Field id of the legalform select in the account edition form, used so the CTA
// lands directly on the category select.
export const LEGALFORM_FIELD_TO_FOCUS = 'ovh_field_legalform';
export const TRACKING_PREFIX = 'Hub::account::user';
export const TRACKING_CONTEXT = {
  chapter1: 'Hub',
  chapter2: 'account',
  chapter3: 'user',
  level2: 'Manager-Account',
  page: 'user::pop-up::other_category',
};
