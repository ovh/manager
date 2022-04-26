import React, { useContext, useEffect, useState } from 'react';

import { useReket } from '@ovh-ux/ovh-reket';

import ProductNavReshuffleContext from './context';

type Props = {
  children: JSX.Element;
};

export const ProductNavReshuffleProvider = ({
  children = null,
}: Props): JSX.Element => {
  const reketInstance = useReket();
  const preferenceKey = 'NAV_RESHUFFLE_BETA_ACCESS';
  const [isLoading, setIsLoading] = useState(true);
  const [isBeta, setIsBeta] = useState(false);
  const [askBeta, setAskBeta] = useState(false);

  let isMounted = true;
  let pnrContext = useContext(ProductNavReshuffleContext);

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

  useEffect(() => {
    reketInstance
      .get(`/me/preferences/manager/${preferenceKey}`)
      .then(({ value }: { value: string }) => {
        setIsBeta(value === 'true');
      })
      .catch((error) => {
        if (error?.status === 404) {
          setAskBeta(true);
        } else {
          throw error;
        }
      })
      .finally(() => isMounted && setIsLoading(false));
    return () => {
      isMounted = false;
    };
  }, []);

  pnrContext = {
    createBetaChoice,
    askBeta,
    isBeta,
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
