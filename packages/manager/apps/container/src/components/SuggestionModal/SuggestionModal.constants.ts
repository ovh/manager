import { Environment, User } from '@ovh-ux/manager-config';
import { ModalToDisplayConfiguration } from '@/types/modal-configuration.type';
import { Suggestion } from '@/types/suggestion';
import { fetchCompanyNumbersSuggestions } from '@/api/suggestion';
import SuggestionModal from '@/components/SuggestionModal/SuggestionModal.component';
import {
  IGNORED_SUGGESTION_TYPES,
  SUGGESTION_TYPE_USER_FIELD_MAP,
  isSuggestionRelevant,
} from '@/helpers/suggestions/suggestionsHelper';

const SIRET_MODAL_FEATURE = 'hub:popup-hub-invite-customer-siret';

export const SuggestionModalConfiguration: ModalToDisplayConfiguration = {
  checks: {
    userCheck: (user: User) =>
      user.legalform === 'corporation' &&
      user.ovhSubsidiary === 'FR' &&
      Object.values(SUGGESTION_TYPE_USER_FIELD_MAP).some(
        (field: keyof User & string) => !user[field],
      ),
    featuresAvailability: [SIRET_MODAL_FEATURE],
    intervalInSeconds: 24 * 60 * 60,
    excludedUrls: [
      {
        appName: (environment: Environment) =>
          environment.getApplicationURL('new-account')
            ? 'new-account'
            : 'dedicated',
        appPath: '#/useraccount/infos',
      },
    ],
  },
  data: {
    queryParams: {
      queryKey: ['suggest', 'company-numbers'],
      queryFn: fetchCompanyNumbersSuggestions,
      select: (data: Suggestion[]) =>
        data.filter(
          (suggestion) => !IGNORED_SUGGESTION_TYPES.includes(suggestion.type),
        ),
    },
    check: (suggestions: Suggestion[], user: User) =>
      suggestions.some((suggestion) => isSuggestionRelevant(suggestion, user)),
  },
  component: SuggestionModal,
};
