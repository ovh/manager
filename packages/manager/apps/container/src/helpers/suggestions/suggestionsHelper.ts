import { User } from '@ovh-ux/manager-config';
import { Suggestion } from '@/types/suggestion';

export const IGNORED_SUGGESTION_TYPES = ['COMPANY NUMBER', 'DUNS', 'NIN'];

export const SUGGESTION_TYPE_USER_FIELD_MAP: Partial<Record<
  Suggestion['type'],
  keyof User & string
>> = {
  SIRET: 'companyNationalIdentificationNumber',
  VAT: 'vat',
  // @TODO: set value during MANAGER-16862
  // SIREN: 'value_to_set';
};
export const isSuggestionRelevant = (suggestion: Suggestion, user: User) =>
  Boolean(SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]) &&
  (!user[SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]] ||
    user[SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]] !== suggestion.id);