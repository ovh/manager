import { User } from "@ovh-ux/manager-config";

import { isComplianceModalCountry } from '../compliance-reminder-modal/complianceReminderModal.helpers';

// The "Autre" category (legalform === 'other') is not compatible with the French
// e-invoicing reform: FR customers holding it must update their category, and so
// must Turkish ones (F1).
export const isUserCategoryOther = (user: User) =>
  user.legalform === 'other' && isComplianceModalCountry(user.country);
