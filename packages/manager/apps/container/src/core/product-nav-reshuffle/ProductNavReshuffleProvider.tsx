import React, { useContext, useEffect, useState } from 'react';

import { useReket } from '@ovh-ux/ovh-reket';

import useContainer from '@/core/container/useContainer';
import { useShell } from '@/context/useApplicationContext';

import ProductNavReshuffleContext from './context';
import { FEEDBACK_URLS } from './constants';

import useOnboarding, {
  ONBOARDING_OPENED_STATE_ENUM,
  ONBOARDING_STATUS_ENUM,
} from '../onboarding';

type Props = {
  children: JSX.Element;
};

export const ProductNavReshuffleProvider = ({
  children = null,
}: Props): JSX.Element => {
  let pnrContext = useContext(ProductNavReshuffleContext);
  const onboardingHelper = useOnboarding();

  const [isLoading, setIsLoading] = useState(true);
  const { betaVersion } = useContainer();

  /**
   * @TODO: manage links for US version
   */
  const getFeedbackUrl = () => {
    let feedbackUrl = FEEDBACK_URLS[`beta${betaVersion}`];
    const [lang] = useShell()
      .getPlugin('i18n')
      .getLocale()
      .split('_');
    feedbackUrl = `${feedbackUrl}?lang=${lang}`;
    return feedbackUrl;
  };

  // onboarding
  const [onboardingOpenedState, setOnboardingOpenedState] = useState(
    ONBOARDING_OPENED_STATE_ENUM.CLOSED,
  );

  const openOnboarding = () => {
    setOnboardingOpenedState(
      onboardingHelper.getNextOpenedState(onboardingOpenedState),
    );
  };

  const startOnboarding = () => {
    setOnboardingOpenedState(ONBOARDING_OPENED_STATE_ENUM.WALKME);
  };

  const closeOnboarding = (onboardingStatus) => {
    setOnboardingOpenedState(ONBOARDING_OPENED_STATE_ENUM.CLOSED);

    return onboardingHelper.updatePreference({
      status: onboardingStatus || ONBOARDING_STATUS_ENUM.CLOSED,
    });
  };

  // account sidebar
  const [isAccountSidebarOpened, setIsAccountSidebarOpened] = useState(false); // or maybe use ux plugin?

  const openAccountSidebar = () => {
    setIsAccountSidebarOpened(true);
  };

  const closeAccountSidebar = () => {
    setIsAccountSidebarOpened(false);
  };

  // navigation sidebar
  const [isNavigationSidebarOpened, setIsNavigationSidebarOpened] = useState(
    false,
  ); // or maybe use ux plugin?

  const openNavigationSidebar = () => {
    setIsNavigationSidebarOpened(true);
  };

  const closeNavigationSidebar = () => {
    setIsNavigationSidebarOpened(false);
  };

  useEffect(() => {
    onboardingHelper
      .init()
      .then((status) => {
        setOnboardingOpenedState(
          onboardingHelper.getOpenedStateFromStatus(status),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  pnrContext = {
    isLoading,
    getFeedbackUrl,
    // onboarding
    onboardingOpenedState,
    openOnboarding,
    startOnboarding,
    closeOnboarding,
    // account sidebar
    isAccountSidebarOpened,
    openAccountSidebar,
    closeAccountSidebar,
    // navigation sidebar
    isNavigationSidebarOpened,
    openNavigationSidebar,
    closeNavigationSidebar,
  };

  return (
    <ProductNavReshuffleContext.Provider value={pnrContext}>
      {children}
    </ProductNavReshuffleContext.Provider>
  );
};

export default ProductNavReshuffleProvider;
