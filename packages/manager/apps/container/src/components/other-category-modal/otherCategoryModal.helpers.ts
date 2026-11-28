import { User } from "@ovh-ux/manager-config";
import {
  E_INVOICING_DESCRIPTION_KEY,
  FR_TERRITORIES,
  GENERIC_DESCRIPTION_KEY,
} from "./otherCategoryModal.constants";

// The "Autre" category (legalform === 'other') can no longer be kept: every
// customer holding it, whatever the country, must update their category.
export const isUserCategoryOther = (user: User) => user.legalform === 'other';

// The French e-invoicing reform only binds French customers (mainland France
// and the overseas departments): they get its wording and link, every other
// country the same request without it.
export const getOtherCategoryDescriptionKey = (country?: string | null) =>
  FR_TERRITORIES.includes((country ?? '').toUpperCase())
    ? E_INVOICING_DESCRIPTION_KEY
    : GENERIC_DESCRIPTION_KEY;
