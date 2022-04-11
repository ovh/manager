import React, { useContext, useEffect, useState } from 'react';

import { useReket } from '@ovh-ux/ovh-reket';
import PropTypes from 'prop-types';

import ProductNavReshuffleContext from './context';

type Props = {
  children: JSX.Element;
};

export const ProductNavReshuffleProvider = ({
  children,
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
      .then((result) => {
        if (accept === false) {
          // @TODO open new tab for survey
        }
        window.location.reload(false);
        return result;
      });
  };

  const createBetaChoice = async (accept = false) => {
    return reketInstance
      .post(`/me/preferences/manager`, {
        key: preferenceKey,
        value: accept ? 'true' : 'false',
      })
      .then((result) => {
        window.location.reload(false);
        return result;
      });
  };

  useEffect(() => {
    reketInstance
      .get(`/me/preferences/manager/${preferenceKey}`)
      .then(({ value }) => {
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

ProductNavReshuffleProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

ProductNavReshuffleProvider.defaultProps = {
  children: null,
};

export default ProductNavReshuffleProvider;
