import { User } from '@ovh-ux/manager-config';
import {
  COMPLIANCE_MODAL_COUNTRIES,
  MISSING_CNIN_CERTIFICATE,
} from './complianceReminderModal.constants';

export const isComplianceModalCountry = (country?: string | null) =>
  COMPLIANCE_MODAL_COUNTRIES.includes((country ?? '').toUpperCase());

export const isUserConcernedByMissingCnin = (user: User) =>
  !!user.certificates?.includes(MISSING_CNIN_CERTIFICATE) &&
  isComplianceModalCountry(user.country);

/**
 * The description names the identifier the country uses: the SIRET in France,
 * the MERSIS No in Turkey (the only two countries the reminder is shown in).
 */
export const missingCninDescriptionKey = (country?: string | null) =>
  (country ?? '').toUpperCase() === 'FR'
    ? 'missing_cnin_modal_description_siret'
    : 'missing_cnin_modal_description_mersis';

/**
 * The account-form anchor the missing-CNIN CTA scrolls to: the SIRET search in
 * France (the SIRET input is locked until a pick), the CNIN input elsewhere.
 */
export const missingCninFieldToFocus = (country?: string | null) =>
  (country ?? '').toUpperCase() === 'FR'
    ? 'siretForm'
    : 'ovh_field_companyNationalIdentificationNumber';
