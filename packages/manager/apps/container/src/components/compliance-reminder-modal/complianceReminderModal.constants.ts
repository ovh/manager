// F1 compliance reminders: the countries they apply to and the missing-CNIN
// reminder (the "Other" category one is `OtherCategoryModal`).

/**
 * The account countries that get the compliance reminders (the missing-CNIN
 * one and `OtherCategoryModal`). The specification writes "TK"
 * for Turkey; the API country code is `TR` (`TK` is Tokelau).
 */
export const COMPLIANCE_MODAL_COUNTRIES = ['FR', 'TR'];

/**
 * `user.certificates` marker. TODO(F1): the final value is still to be
 * confirmed; "missingCNIN" is provisional.
 */
export const MISSING_CNIN_CERTIFICATE = 'missingCNIN';
export const MISSING_CNIN_MODAL_NAME = 'MissingCninModal';
/** The missing-CNIN reminder comes back at most once an hour. */
export const MISSING_CNIN_INTERVAL_IN_S = 60 * 60;

export const TRACKING_PREFIX = 'Hub::account::user';
export const TRACKING_CONTEXT = {
  chapter1: 'Hub',
  chapter2: 'account',
  chapter3: 'user',
  level2: 'Manager-Account',
};
