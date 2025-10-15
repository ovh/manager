import { Handler } from "@ovh-ux/manager-core-test-utils";
import { activeSuggestions, inactiveSuggestions } from "./suggestions.data";

export const getSuggestionsMocks = (params: {
  hasSuggestions?: boolean;
  hasActiveSuggestions?: boolean;
} = {}): Handler[] => {
  const { hasSuggestions = true, hasActiveSuggestions = true } = params;

  return [
    {
      url: 'me/suggest/companyIdentificationNumbers',
      response: hasSuggestions
        ? hasActiveSuggestions ? activeSuggestions : inactiveSuggestions
        : [],
      api: 'v6',
      delay: 0,
    },
  ];
};
