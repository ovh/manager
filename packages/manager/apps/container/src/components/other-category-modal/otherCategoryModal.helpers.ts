import { Country, User } from "@ovh-ux/manager-config";

import { CERTIFICATE_CHECK_COUNTRIES } from '../company-information-modal/companyInformationModal.constants';

// The "Autre" category (legalform === 'other') is removed for every country:
// any account still holding it must update its category.
export const isUserCategoryOther = (user: User) => user.legalform === 'other';

// The French e-invoicing reform wording and its economie.gouv.fr link only make
// sense where the reform applies: mainland France and the overseas territories
// it reaches (same list as the company information modal). Every other account
// gets the same request without them.
export const isFrenchAccount = (user?: Pick<User, 'country'> | null) =>
  CERTIFICATE_CHECK_COUNTRIES.includes(
    (user?.country ?? '').toUpperCase() as Country,
  );

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

// The display check: an "Autre" account that has not dismissed the
// reminder during this session.
export const shouldRemindOtherCategory = (user: User) =>
  isUserCategoryOther(user) && !isOtherCategoryDismissed();
