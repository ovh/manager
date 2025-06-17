import { User } from '@ovh-ux/manager-config';
import { Suggestion } from '@/types/suggestion';
import { SUGGESTION_TYPE_USER_FIELD_MAP } from '@/components/SuggestionModal/SuggestionModal.constants';

export const isUserConcernedBySuggestion = (user: User) =>
  user.legalform === 'corporation' &&
  user.ovhSubsidiary === 'FR';

export const isSuggestionRelevant = (suggestion: Suggestion, user: User) => {
  const userField = user[SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]];
  return Boolean(SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]) &&
    (!userField || userField !== suggestion.id);
};