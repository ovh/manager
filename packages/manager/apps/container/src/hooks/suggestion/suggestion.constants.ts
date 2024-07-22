import { User } from '@ovh-ux/manager-config';
import { Suggestion } from '@/types/suggestion';

export const SUGGESTION_MODAL_DISPLAY_PREFERENCE =
  'TIME_TO_DISPLAY_SUGGESTION_MODAL_UPDATE';

export const TIME_BETWEEN_SUGGESTION_MODAL_DISPLAY = 24 * 60 * 60 * 1000; // 24h

export const IGNORED_SUGGESTION_TYPES = ['COMPANY NUMBER', 'DUNS', 'NIN'];

export const SUGGESTION_TYPE_USER_FIELD_MAP: Partial<Record<
  Suggestion['type'],
  keyof User & string
>> = {
  SIRET: 'companyNationalIdentificationNumber',
  VAT: 'vat',
  // TODO: set value during MANAGER-16862
  // SIREN: 'value_to_set';
};
