import {
  DefinedInitialDataOptions,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { User } from '@ovh-ux/manager-config';
import { fetchCompanyNumbersSuggestions } from '@/api/suggestion';
import { Suggestion } from '@/types/suggestion';
import { createPreferences } from '@/api/preferences';
import {
  IGNORED_SUGGESTION_TYPES,
  SUGGESTION_MODAL_DISPLAY_PREFERENCE,
  SUGGESTION_TYPE_USER_FIELD_MAP,
  TIME_BETWEEN_SUGGESTION_MODAL_DISPLAY,
} from '@/hooks/suggestion/suggestion.constants';
import { useShell } from '@/context';
import { useModals } from '@/context/modals';
import { ModalTypes } from '@/context/modals/modals.context';
import { usePreferences } from '@/hooks/preferences/usePreferences';
import { useTime } from '@/hooks/time/useTime';

export const useCompanyNumbersSuggestion = (
  options?: Partial<DefinedInitialDataOptions<Suggestion[]>>,
) =>
  useQuery({
    ...options,
    queryKey: ['suggest', 'company-numbers'],
    queryFn: fetchCompanyNumbersSuggestions,
  });

export const useUpdateSuggestionForUserProfilePreference = (time: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      createPreferences(SUGGESTION_MODAL_DISPLAY_PREFERENCE, time),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['preferences', SUGGESTION_MODAL_DISPLAY_PREFERENCE],
      });
    },
  });
};

export const useSuggestionForUserProfile = (accountEditionLink: string) => {
  const shell = useShell();
  const user = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser() as User;
  const { ovhSubsidiary: subsidiary, legalform } = user;
  const { current } = useModals();
  const [isReady, setIsReady] = useState(false);
  const [shouldBeDisplayed, setShouldBeDisplayed] = useState(false);
  const isUserMissingInfo = useCallback(() => {
    const userFields = Object.values(SUGGESTION_TYPE_USER_FIELD_MAP);
    return userFields.some((field: string) => !user[field]);
  }, [user]);
  const isSuggestionRelevant = useCallback(
    (suggestion: Suggestion) => {
      const userField = SUGGESTION_TYPE_USER_FIELD_MAP[suggestion.type];
      return (
        userField && (!user[userField] || user[userField] !== suggestion.id)
      );
    },
    [user],
  );

  const isCurrentModalActive = useMemo(
    () => current === ModalTypes.suggestion,
    [current],
  );
  const isOnAccountEditionPage = useMemo(
    () => window.location.href === accountEditionLink,
    [window.location.href],
  );
  const isUserConcernedWithModal = useMemo(
    () =>
      subsidiary === 'FR' && legalform === 'corporation' && isUserMissingInfo(),
    [user, subsidiary, legalform],
  );

  /*
    API calls sequence:
    - Once the current modal is the suggestion one (and user is not on the account edition page) we'll call the
    preference API
    - Once we retrieved the preference, if it is defined we'll request the time API otherwise
    we'll directly fetch the suggestion API
    - Once we retrieved the time, we'll compare it to the preference, if preference is older than 1 day, we'll
    fetch the suggestion otherwise we update the isReady state to true
    - Once we retrieved the list of suggestion we'll check if there is any, if so we'll update both isReady
    and shouldBeDisplayed to true, otherwise we'll update isReady state to true and shouldBeDisplayed to false
   */
  const { data: preference, isError: isPreferencesInError } = usePreferences(
    SUGGESTION_MODAL_DISPLAY_PREFERENCE,
    {
      enabled:
        isCurrentModalActive &&
        !isOnAccountEditionPage &&
        isUserConcernedWithModal,
    },
  );
  const { data: time, isError: isTimeInError } = useTime({
    enabled: preference !== undefined,
  });
  const isTimeToShowModal = useMemo(
    () =>
      preference === undefined
        ? undefined
        : preference === null ||
          (time === undefined
            ? undefined
            : time - Number(preference) >=
              TIME_BETWEEN_SUGGESTION_MODAL_DISPLAY),
    [preference, time],
  );
  const {
    data: suggestions,
    isError: isSuggestionInError,
  } = useCompanyNumbersSuggestion({
    enabled: isTimeToShowModal === true,
    select: (data) =>
      data.filter(
        (suggestion) =>
          !IGNORED_SUGGESTION_TYPES.includes(suggestion.type) &&
          isSuggestionRelevant(suggestion),
      ),
  });

  const {
    mutate: updatePreference,
  } = useUpdateSuggestionForUserProfilePreference(time);

  useEffect(() => {
    if (isTimeToShowModal !== undefined && !isTimeToShowModal) {
      setIsReady(true);
    }
  }, [isTimeToShowModal]);

  useEffect(() => {
    if (suggestions) {
      if (suggestions.length) {
        setShouldBeDisplayed(true);
      }
      setIsReady(true);
    }
  }, [suggestions]);

  useEffect(() => {
    if (isSuggestionInError || isPreferencesInError || isTimeInError) {
      setIsReady(true);
    }
  }, [isSuggestionInError, isPreferencesInError, isTimeInError]);

  return {
    isReady,
    shouldBeDisplayed,
    updatePreference,
    suggestions,
  };
};
