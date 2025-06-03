import { User } from '@ovh-ux/manager-config';
import { Suggestion } from '@/types/suggestion';

export const SUGGESTION_TYPE_USER_FIELD_MAP: Partial<Record<
  Suggestion['type'],
  keyof User & string
>> = {
  SIRET: 'companyNationalIdentificationNumber',
  VAT: 'vat',
  // @TODO: set value during MANAGER-16862
  // SIREN: 'value_to_set';
};
export const IGNORED_SUGGESTION_TYPES = ['COMPANY NUMBER', 'DUNS', 'NIN'];
export const SIRET_MODAL_FEATURE = 'hub:popup-hub-invite-customer-siret';
export const INTERVAL_BETWEEN_DISPLAY_IN_S = 24 * 60 * 60;
