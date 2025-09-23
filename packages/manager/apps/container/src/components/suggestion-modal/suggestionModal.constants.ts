import { User } from '@ovh-ux/manager-config';
import { Suggestion } from '@/types/suggestion';

export const SUGGESTION_TYPE_USER_FIELD_MAP: Partial<Record<
  Suggestion['type'],
  keyof User & string
>> = {
  SIRET: 'companyNationalIdentificationNumber',
  NIN: 'nationalIdentificationNumber',
  VAT: 'vat',
};
export const IGNORED_SUGGESTION_TYPES = ['COMPANY NUMBER', 'DUNS'];
export const SIRET_MODAL_FEATURE = 'hub:popup-hub-invite-customer-siret';
export const INTERVAL_BETWEEN_DISPLAY_IN_S = 24 * 60 * 60;
export const MODAL_NAME = 'SuggestionModal';

export const TRACKING_PREFIX = 'Hub::account::user';
export const TRACKING_CONTEXT = {
  chapter1: 'Hub',
  chapter2: 'account',
  chapter3: 'user',
  level2: 'Manager-Account',
  page: 'user::pop-up::siret_update_informations',
};
