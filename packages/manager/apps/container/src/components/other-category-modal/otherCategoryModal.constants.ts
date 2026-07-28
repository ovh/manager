// Reuse the shared "tout savoir sur la facturation électronique" documentation
// link declared for the company information modal so both e-invoicing modals point
// to the same official page.
export { ELECTRONIC_BILLING_REGULATION_LINK } from '../company-information-modal/companyInformationModal.constants';

export const MODAL_NAME = 'OtherCategoryModal';
// Feature flag gating the whole "Autre" category e-invoicing flow (FR only).
export const OTHER_CATEGORY_FEATURE = 'account:fr-e-invoicing-other-category';
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
