import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import fetchPendingAgreements from '@/api/agreements';
import { Agreements } from '@/types/agreements';
import { useAuthorizationIam, useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useTime } from '@/hooks/time/useTime';
import { useEffect, useMemo, useState } from 'react';
import { usePreferences } from '@/hooks/preferences/usePreferences';
import useAccountUrn from '@/hooks/accountUrn/useAccountUrn';
import { useModals } from '@/context/modals';
import { ModalTypes } from '@/context/modals/modals.context';

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

  const { data: featureAvailability} = useFeatureAvailability([FEATURE], { enabled: isCurrentModalActive && !isOnAgreementsPage });
  const { data: time } = useTime({ enabled: Boolean(featureAvailability?.[FEATURE]) });
  const { data: isTimeToShowModal } = usePreferences('AGREEMENTS_MODAL_UPDATE', {
    enabled: Boolean(time),
    select: (pref: any | null) => pref === null || ((Number(pref) - time) < 0),
  });
  const { data: urn } = useAccountUrn({ enabled: isTimeToShowModal !== undefined });
  const { isAuthorized: canUserAcceptAgreements, data: authorizations } = useAuthorizationIam(['account:apiovh:me/agreements/accept'], urn);
  const { data: agreements } = usePendingAgreements({ enabled: canUserAcceptAgreements });

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

  return {
    isReady,
    shouldBeDisplayed,
  };
};
