import { User } from "@ovh-ux/manager-config";

import { isComplianceModalCountry } from '../compliance-reminder-modal/complianceReminderModal.helpers';

// The "Autre" category (legalform === 'other') is not compatible with the French
// e-invoicing reform: FR customers holding it must update their category, and so
// must Turkish ones (F1).
export const isUserCategoryOther = (user: User) =>
  user.legalform === 'other' && isComplianceModalCountry(user.country);

// F1: the French e-invoicing reform wording and its economie.gouv.fr link only
// make sense in France; Turkish accounts get the same request without them.
export const isTurkishAccount = (user?: Pick<User, 'country'> | null) =>
  (user?.country ?? '').toUpperCase() === 'TR';

// RG1 "at every login": once dismissed, the reminder stays closed for the rest of
// the browser session (sessionStorage) and comes back with the next one, instead
// of on every page load.
export const OTHER_CATEGORY_DISMISSED_KEY =
  'manager-container:other-category-dismissed';

export const isOtherCategoryDismissed = () => {
  try {
    return window.sessionStorage.getItem(OTHER_CATEGORY_DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setOtherCategoryDismissed = () => {
  try {
    window.sessionStorage.setItem(OTHER_CATEGORY_DISMISSED_KEY, 'true');
  } catch {
    // Storage unavailable: the modal is still closed for this page load.
  }
};

// The display check: an "Autre" FR/TR account that has not dismissed the
// reminder during this session.
export const shouldRemindOtherCategory = (user: User) =>
  isUserCategoryOther(user) && !isOtherCategoryDismissed();
