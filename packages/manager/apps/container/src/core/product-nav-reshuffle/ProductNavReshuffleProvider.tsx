import { useContext, useState } from 'react';
import useContainer from '@/core/container/useContainer';
import { useShell } from '@/context/useApplicationContext';
import ProductNavReshuffleContext from './context';
import { FEEDBACK_URLS } from './constants';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';
import { BetaVersion } from '../container/context';
import { MOBILE_WIDTH_RESOLUTION } from '@/container/common/constants';
import { useMediaQuery } from 'react-responsive';
import useOnboarding, { ONBOARDING_OPENED_STATE_ENUM } from '../onboarding';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const ProductNavReshuffleProvider = ({
  children = null,
}: Props): JSX.Element => {
  let pnrContext = useContext(ProductNavReshuffleContext);

  const [currentNavigationNode, setCurrentNavigationNode] = useState<Node>(null);
  const [navigationTree, setNavigationTree] = useState({});
  const { betaVersion } = useContainer();
  const shell = useShell();
  const isMobile = useMediaQuery({
    query: `(max-width: ${MOBILE_WIDTH_RESOLUTION}px)`,
  });
  const onboarding = useOnboarding();


  /**
   * @TODO: manage links for US version
   */
  const getFeedbackUrl = () => {
    let feedbackUrl = FEEDBACK_URLS[`beta${betaVersion as BetaVersion}`];
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

  const startOnboarding = () => {
    setOnboardingOpenedState(ONBOARDING_OPENED_STATE_ENUM.WALKME);
  };

  const openOnboarding = () => {
    setOnboardingOpenedState(ONBOARDING_OPENED_STATE_ENUM.WELCOME);
    if (!shell.getPlugin('ux').isChatbotReduced()) {
      // reduce chatbot if welcome popover is displayed
      shell.getPlugin('ux').reduceChatbot();
    }
  };

  const closeOnboarding = (isDone: boolean) => {
    onboarding.updatePreference(isDone);
    setOnboardingOpenedState(ONBOARDING_OPENED_STATE_ENUM.CLOSED);
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

  pnrContext = {
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
    isMobile,
  };

  return (
    <ProductNavReshuffleContext.Provider value={pnrContext}>
      {children}
    </ProductNavReshuffleContext.Provider>
  );
};

export default ProductNavReshuffleProvider;
