import { User } from '@ovh-ux/manager-config';
import { Suggestion } from '@/types/suggestion';
import { SUGGESTION_TYPE_USER_FIELD_MAP } from '@/components/suggestion-modal/suggestionModal.constants';

export const isUserConcernedBySuggestion = (user: User) =>
  user.legalform === 'corporation' &&
  user.country === 'FR';

export const isSuggestionRelevant = (suggestion: Suggestion, user: User) => {
  const userField = user[SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]];
  return suggestion.isActive && Boolean(SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]) &&
    (!userField || userField !== suggestion.id );
};