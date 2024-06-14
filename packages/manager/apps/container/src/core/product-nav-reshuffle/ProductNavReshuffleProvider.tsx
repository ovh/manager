import React, { useContext, useEffect, useState } from 'react';
import useContainer from '@/core/container/useContainer';
import { useShell } from '@/context/useApplicationContext';
import ProductNavReshuffleContext from './context';
import { FEEDBACK_URLS } from './constants';
import useOnboarding, {
  ONBOARDING_OPENED_STATE_ENUM,
  ONBOARDING_STATUS_ENUM,
} from '../onboarding';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const ProductNavReshuffleProvider = ({
  children = null,
}: Props): JSX.Element => {
  let pnrContext = useContext(ProductNavReshuffleContext);
  const onboardingHelper = useOnboarding();
  const [currentNavigationNode, setCurrentNavigationNode] = useState<Node>({});
  const [navigationTree, setNavigationTree] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { betaVersion } = useContainer();
  const shell = useShell();

  /**
   * @TODO: manage links for US version
   */
  const getFeedbackUrl = () => {
    let feedbackUrl = FEEDBACK_URLS[`beta${betaVersion}`];
    const [lang] = shell
      .getPlugin('i18n')
      .getLocale()
      .split('_');
    feedbackUrl = `${feedbackUrl}?lang=${lang}`;
    return feedbackUrl;
  };

  // onboarding
  const [onboardingOpenedState, setOnboardingOpenedState] = useState<string>(
    ONBOARDING_OPENED_STATE_ENUM.CLOSED,
  );

  const openOnboarding = () => {
    const nextOpenedState = onboardingHelper.getNextOpenedState(
      onboardingOpenedState,
    );

    setOnboardingOpenedState(nextOpenedState);
    if (
      nextOpenedState === ONBOARDING_OPENED_STATE_ENUM.WELCOME &&
      !shell.getPlugin('ux').isChatbotReduced()
    ) {
      // reduce chatbot if welcome popover is displayed
      shell.getPlugin('ux').reduceChatbot();
    }
  };

  const startOnboarding = () => {
    setOnboardingOpenedState(ONBOARDING_OPENED_STATE_ENUM.WALKME);
  };

  const closeOnboarding = (onboardingStatus: string) => {
    setOnboardingOpenedState(ONBOARDING_OPENED_STATE_ENUM.CLOSED);
    // Onboarding forced only for PNR V2 alpha; to remove for the beta.
    onboardingHelper.forceOnboardingDisplayed(false);

    return onboardingHelper.updatePreference({
      status: onboardingStatus || ONBOARDING_STATUS_ENUM.CLOSED,
    });
  };

  const reduceOnboarding = () => {
    setOnboardingOpenedState(ONBOARDING_OPENED_STATE_ENUM.CLOSED);
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
      .then((status: string) => {
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
    reduceOnboarding,
    // account sidebar
    isAccountSidebarOpened,
    openAccountSidebar,
    closeAccountSidebar,
    // navigation sidebar
    isNavigationSidebarOpened,
    openNavigationSidebar,
    closeNavigationSidebar,
    currentNavigationNode,
    setCurrentNavigationNode,
    navigationTree,
    setNavigationTree,
  };

  return (
    <ProductNavReshuffleContext.Provider value={pnrContext}>
      {children}
    </ProductNavReshuffleContext.Provider>
  );
};

export default ProductNavReshuffleProvider;
