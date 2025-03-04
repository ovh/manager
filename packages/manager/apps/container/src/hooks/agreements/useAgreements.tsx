import { useEffect, useMemo, useState } from 'react';
import { DefinedInitialDataOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import fetchPendingAgreements from '@/api/agreements';
import { Agreements } from '@/types/agreements';
import { useAuthorizationIam, useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useTime } from '@/hooks/time/useTime';
import { usePreferences } from '@/hooks/preferences/usePreferences';
import { useAccountUrn } from '@/hooks/accountUrn/useAccountUrn';
import { useModals } from '@/context/modals';
import { ModalTypes } from '@/context/modals/modals.context';
import { createPreferences } from '@/api/preferences';
import { MINIMUM_TIME_INTERVAL_IN_S } from '@/core/onboarding';

export const usePendingAgreements = (options?: Partial<DefinedInitialDataOptions<Agreements[]>>) =>
  useQuery({
    ...options,
    queryKey: ['pending-agreements'],
    queryFn: fetchPendingAgreements,
  });

const FEATURE = 'billing:agreementsUpdateModal';

export const useAgreementsUpdate = (contractsLink: string) => {
  const { current } = useModals();
  const [ isReady, setIsReady ] = useState(false);
  const [ shouldBeDisplayed, setShouldBeDisplayed ] = useState(false);

  const isCurrentModalActive = useMemo(() => current === ModalTypes.agreements, [current]);
  const isOnAgreementsPage = useMemo(() => window.location.href === contractsLink, [window.location.href]);

  /*
    API calls sequence:
    - Once the current modal is the agreements one (and user is not on the agreements page) we'll call the
    feature availability API
    - Once we retrieved the feature availability, if feature is available we'll fetch the preferences API otherwise
    we'll update the isReady state to true
    - Once we retrieved the preferences, we'll fetch time if the preference exist to compare both time otherwise we'll
    fetch account urn
    - If the preference exist, once we fetched time we'll compare both value, if preference is older than 1 day, we'll
    fetch the account urn otherwise we update the isReady state to true
    - Once we retrieved the account urn, we'll fetch the IAM API
    - Once we retrieved the IAM authorization, if the user is authorized to update their agreements we'll fetch the
    list of agreements to validate
    - Once we retrieved the list of agreements to validate we'll check if their is any, if so we'll update both isReady
    and shouldBeDisplayed to true, otherwise we'll update isReady state to true and shouldBeDisplayed to false
   */
  const { data: featureAvailability, isError: isFeatureAvailabilityInError} = useFeatureAvailability([FEATURE], { enabled: isCurrentModalActive && !isOnAgreementsPage });
  const { data: preference, isError: isPreferencesInError } = usePreferences('TIME_TO_DISPLAY_AGREEMENTS_MODAL_UPDATE', {
    enabled: Boolean(featureAvailability?.[FEATURE]),
  });
  const { data: time, isError: isTimeInError } = useTime({ enabled: preference !== undefined });
  const isTimeToShowModal = useMemo(() =>
    preference === undefined
      ? undefined
      : (preference === null || (time === undefined ? undefined : (time - (Number(preference)) >= MINIMUM_TIME_INTERVAL_IN_S))),
    [preference, time],
  );
  const { data: urn, isError: isAccountUrnInError } = useAccountUrn({ enabled: isTimeToShowModal === true });
  const { isAuthorized: canUserAcceptAgreements, data: authorizations, isError: isIamAuthorizationsInError } = useAuthorizationIam(['account:apiovh:me/agreements/accept'], urn);
  const { data: agreements, isError: isAgreementsInError } = usePendingAgreements({ enabled: canUserAcceptAgreements });

  const { mutate: updatePreference } = useUpdateAgreementsUpdatePreference(time);

  useEffect(() => {
    if (featureAvailability && !featureAvailability[FEATURE]) {
      setIsReady(true);
    }
  }, [featureAvailability]);

  useEffect(() => {
    if (isTimeToShowModal !== undefined && !isTimeToShowModal) {
      setIsReady(true);
    }
  }, [isTimeToShowModal]);

  useEffect(() => {
    if (authorizations !== undefined && !canUserAcceptAgreements) {
      setIsReady(true);
    }
  }, [canUserAcceptAgreements]);

  useEffect(() => {
    if (agreements) {
      if (agreements.length) {
        setShouldBeDisplayed(true);
      }
      setIsReady(true);
    }
  }, [agreements]);

  useEffect(() => {
    if (isFeatureAvailabilityInError || isPreferencesInError || isTimeInError || isAccountUrnInError || isIamAuthorizationsInError || isAgreementsInError) {
      setIsReady(true);
    }
  }, [isFeatureAvailabilityInError, isPreferencesInError, isTimeInError, isAccountUrnInError, isIamAuthorizationsInError, isAgreementsInError])

  return {
    isReady,
    shouldBeDisplayed,
    updatePreference
  };
};

export const useUpdateAgreementsUpdatePreference = (time: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createPreferences('TIME_TO_DISPLAY_AGREEMENTS_MODAL_UPDATE', time),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['preferences', 'TIME_TO_DISPLAY_AGREEMENTS_MODAL_UPDATE']});
    },
  });
};
