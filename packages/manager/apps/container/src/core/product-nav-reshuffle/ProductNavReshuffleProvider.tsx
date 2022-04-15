import React, { useContext, useEffect, useState } from 'react';

import { useReket } from '@ovh-ux/ovh-reket';

import ProductNavReshuffleContext from './context';

export const BETA_V1 = 1;
export const BETA_V2 = 2;

type Props = {
  children: JSX.Element;
};

export const ProductNavReshuffleProvider = ({
  children = null,
}: Props): JSX.Element => {
  const reketInstance = useReket();
  const preferenceKey = 'NAV_RESHUFFLE_BETA_ACCESS';
  const [isLoading, setIsLoading] = useState(true);

  // true if we should we ask the user if he want to test beta version
  const [askBeta, setAskBeta] = useState(false);

  // 1 for beta1, 2 for beta2, otherwise null if not a beta tester
  const [betaVersion, setBetaVersion] = useState(null);

  // user choice about using or not the beta
  const [useBeta, setUseBeta] = useState(false);

  let pnrContext = useContext(ProductNavReshuffleContext);

  /**
   * Check in feature availability if the user is a beta tester
   * and returns the beta version if it's the case.
   */
  const fetchBetaVersion = async () => {
    return reketInstance
      .get(`/feature/pnr:betaV1,pnr:betaV2/availability`, {
        requestType: 'aapi',
      })
      .then((value) => {
        if (value['pnr:betaV1'] === true) {
          return BETA_V1;
        }
        if (value['pnr:betaV2'] === true) {
          return BETA_V2;
        }
        return null;
      })
      .finally(() => null);
  };

  const fetchBetaChoice = async () => {
    return reketInstance
      .get(`/me/preferences/manager/${preferenceKey}`)
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
    return reketInstance
      .put(`/me/preferences/manager/${preferenceKey}`, {
        key: preferenceKey,
        value: accept ? 'true' : 'false',
      })
      .then((result: unknown) => {
        if (accept === false) {
          // @TODO open new tab for survey
        }
        window.location.reload();
        return result;
      });
  };

  const createBetaChoice = async (accept = false) => {
    return reketInstance
      .post(`/me/preferences/manager`, {
        key: preferenceKey,
        value: accept ? 'true' : 'false',
      })
      .then((result: unknown) => {
        window.location.reload();
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
    fetchBetaVersion()
      .then((version) => {
        setBetaVersion(version);
        if (version) {
          return fetchBetaChoice();
        }
        return null;
      })
      .finally(() => setIsLoading(false));
  }, []);

  pnrContext = {
    createBetaChoice,
    askBeta,
    betaVersion,
    useBeta,
    isLoading,
    updateBetaChoice,
  };

  return (
    <ProductNavReshuffleContext.Provider value={pnrContext}>
      {children}
    </ProductNavReshuffleContext.Provider>
  );
};

export default ProductNavReshuffleProvider;
