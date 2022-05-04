import React, { useContext, useEffect, useState } from 'react';
import { useReket } from '@ovh-ux/ovh-reket';

import ContainerContext from './context';
import {
  getBetaAvailabilityFromLocalStorage,
  setBetaAvailabilityToLocalStorage,
  getBetaVersionFromLocalStorage,
  isBetaForced,
} from './localStorage';

export const BETA_V1 = 1;
export const BETA_V2 = 2;

export const ContainerProvider = ({ children }) => {
  const reketInstance = useReket();
  const preferenceKey = 'NAV_RESHUFFLE_BETA_ACCESS';
  const [isLoading, setIsLoading] = useState(true);

  // true if we should we ask the user if he want to test beta version
  const [askBeta, setAskBeta] = useState(false);

  // 1 for beta1, 2 for beta2, otherwise null if not a beta tester
  const [betaVersion, setBetaVersion] = useState(null);

  // user choice about using or not the beta
  const [useBeta, setUseBeta] = useState(false);

  const [isChatbotEnabled, setIsChatbotEnabled] = useState(false);

  let containerContext = useContext(ContainerContext);

  const fetchFeatureAvailability = async () => {
    const getBetaVersion = (value) => {
      if (isBetaForced()) {
        return getBetaVersionFromLocalStorage();
      }
      if (value['pnr:betaV2']) {
        return BETA_V2;
      }
      if (value['pnr:betaV1']) {
        return BETA_V1;
      }
      return null;
    };

    return reketInstance
      .get(`/feature/chatbot,pnr:betaV1,pnr:betaV2/availability`, {
        requestType: 'aapi',
      })
      .then((value) => ({
        version: getBetaVersion(value),
        chatbot: !!value.chatbot,
      }))
      .catch(() => ({
        version: null,
        chatbot: false,
      }));
  };

  const fetchBetaChoice = async () => {
    const betaValue = getBetaAvailabilityFromLocalStorage();
    const fetchPromise = betaValue
      ? Promise.resolve({ value: betaValue })
      : reketInstance.get(`/me/preferences/manager/${preferenceKey}`);

    return fetchPromise
      .then(({ value }) => {
        setUseBeta(value === 'true');
      })
      .catch((error) => {
        if (error?.status === 404) {
          setAskBeta(true);
        } else {
          throw error;
        }
      });
  };

  const updateBetaChoice = async (accept = false) => {
    const updatePromise = isBetaForced()
      ? Promise.resolve(setBetaAvailabilityToLocalStorage(accept))
      : reketInstance.put(`/me/preferences/manager/${preferenceKey}`, {
          key: preferenceKey,
          value: accept.toString(),
        });

    return updatePromise.then((result) => {
      if (!accept) {
        // @TODO open new tab for survey
      }
      window.location.reload(false);
      return result;
    });
  };

  const createBetaChoice = async (accept = false) => {
    const createPromise = isBetaForced()
      ? Promise.resolve(setBetaAvailabilityToLocalStorage(accept))
      : reketInstance.post(`/me/preferences/manager`, {
          key: preferenceKey,
          value: accept.toString(),
        });

    return createPromise.then((result) => {
      window.location.reload(false);
      return result;
    });
  };

  /**
   * Initialisation is done here, we check if the user is a beta tester,
   * then we check his preferences regarding using or not the beta version.
   * If he has not preferences saved, we set askBeta to true in order
   * to provide him the choice.
   */
  useEffect(() => {
    fetchFeatureAvailability()
      .then(({ version, chatbot }) => {
        setBetaVersion(version);
        setIsChatbotEnabled(chatbot);
        if (version) {
          return fetchBetaChoice();
        }
        return null;
      })
      .finally(() => setIsLoading(false));
  }, []);

  containerContext = {
    createBetaChoice,
    askBeta,
    betaVersion,
    useBeta,
    isChatbotEnabled,
    isLoading,
    updateBetaChoice,
  };

  return (
    <ContainerContext.Provider value={containerContext}>
      {children}
    </ContainerContext.Provider>
  );
};

export default ContainerProvider;
