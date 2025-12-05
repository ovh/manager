import { LegalForm, User } from '@ovh-ux/manager-config';
import { Suggestion } from '@/types/suggestion';
import { SUGGESTION_TYPE_USER_FIELD_MAP } from '@/components/suggestion-modal/suggestionModal.constants';

const TYPE_USER = ['corporation', 'association', 'other'];

export const isAssociationOrOther = (legalform: LegalForm) =>
  TYPE_USER.includes(legalform) && legalform !== 'corporation';

export const isUserConcernedBySuggestion = (user: User) =>
  TYPE_USER.includes(user.legalform) && user.country === 'FR';

export const isSuggestionRelevant = (suggestion: Suggestion, user: User) => {
  const userField = user[SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]];
  return suggestion.isActive && Boolean(SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]) &&
    (!userField || userField !== suggestion.id );
};
