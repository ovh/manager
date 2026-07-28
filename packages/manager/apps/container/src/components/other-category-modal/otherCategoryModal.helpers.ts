import { User } from "@ovh-ux/manager-config";

// The "Autre" category (legalform === 'other') is not compatible with the French
// e-invoicing reform: FR customers holding it must update their category.
export const isUserCategoryOther = (user: User) =>
  user.legalform === 'other' && user.country === 'FR';
