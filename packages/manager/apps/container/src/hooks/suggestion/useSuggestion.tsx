import { User } from "@ovh-ux/manager-config";
import { useApplication } from "@/context";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyNumbersSuggestions } from "@/api/suggestion";
import { Suggestion } from "@/types/suggestion";
import { IGNORED_SUGGESTION_TYPES } from "@/components/SuggestionModal/SuggestionModal.constants";
import { isSuggestionRelevant } from "@/helpers/suggestions/suggestionsHelper";
import { useCallback } from "react";

export const useSuggestionTargetUrl = () => {
  const { shell } = useApplication();
  const environment = shell.getPlugin('environment').getEnvironment();
  const appName = environment.getApplicationURL('new-account')
    ? 'new-account'
    : 'dedicated';
  return shell
    .getPlugin('navigation')
    .getURL(appName, '#/useraccount/infos');
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

export const useSuggestionsCheck = (user: User) => useCallback(
  (suggestions: Suggestion[]) => 
    suggestions.some((suggestion) => isSuggestionRelevant(suggestion, user)),
  [user],
);