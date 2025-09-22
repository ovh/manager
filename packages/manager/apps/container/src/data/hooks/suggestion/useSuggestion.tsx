import { useCallback } from "react";
import { AxiosError } from "axios";
import { User } from "@ovh-ux/manager-config";
import { useApplication } from "@/context";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyNumbersSuggestions } from "@/data/api/suggestion";
import { Suggestion } from "@/types/suggestion";
import { IGNORED_SUGGESTION_TYPES } from "@/components/suggestion-modal/suggestionModal.constants";
import { isSuggestionRelevant } from "@/helpers/suggestions/suggestionsHelper";

export const useSuggestionTargetUrl = () => {
  const { shell } = useApplication();
  return shell
    .getPlugin('navigation')
    .getURL('account', '#/useraccount/infos');
};

export const useSuggestions = (enabled: boolean) => useQuery({
  queryKey: ['suggest', 'company-numbers'],
  queryFn: fetchCompanyNumbersSuggestions,
  select: (data: Suggestion[]) =>
    data.filter(
      (suggestion) => !IGNORED_SUGGESTION_TYPES.includes(suggestion.type),
    ),
  enabled,
});

export const useSuggestionsCheck = (user: User, error?: Error) => useCallback(
  (suggestions: Suggestion[]) => {
    if (error) {
      return false;
    }
    const ninSuggestion = suggestions.find((suggestion) => suggestion.type === 'NIN');
    if (ninSuggestion?.isActive) {
      return false;
    }
    return suggestions.some((suggestion) => isSuggestionRelevant(suggestion, user));
  },
  [user],
);
