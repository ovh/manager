import { User } from '@ovh-ux/manager-config';
import { ModalToDisplayConfiguration } from '@/types/modal-configuration.type';
import { Suggestion } from '@/types/suggestion';
import { fetchCompanyNumbersSuggestions } from '@/api/suggestion';
import SuggestionModal from '@/components/SuggestionModal/SuggestionModal.component';

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
export const TRACKING_PREFIX = 'complete-profile-invitation::fill-';
export const SIRET_MODAL_FEATURE = 'hub:popup-hub-invite-customer-siret';

export const isSuggestionRelevant = (suggestion: Suggestion, user: User) =>
  SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type] &&
  (!user[SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]] ||
    user[SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type]] !== suggestion.id);

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
        appName: 'account',
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
