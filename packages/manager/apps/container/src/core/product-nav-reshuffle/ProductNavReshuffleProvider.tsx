import { useContext, useState, useEffect } from 'react';
import useContainer from '@/core/container/useContainer';
import { useShell } from '@/context/useApplicationContext';
import ProductNavReshuffleContext from './context';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';
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
  const [isMobile, setIsMobile] = useState(useMediaQuery({
    query: `(max-width: ${MOBILE_WIDTH_RESOLUTION}px)`,
  }));

  const onboarding = useOnboarding();

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

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth <= MOBILE_WIDTH_RESOLUTION ?
        setIsMobile(true) : setIsMobile(false);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  pnrContext = {
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
