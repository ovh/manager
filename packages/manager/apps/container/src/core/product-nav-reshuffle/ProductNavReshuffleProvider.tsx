import { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { fetchFeatureAvailabilityData } from '@ovh-ux/manager-react-components';
import { useLocation } from 'react-router-dom';
import { useShell } from '@/context/useApplicationContext';
import ProductNavReshuffleContext, {
  ProductNavReshuffleContextType,
} from './product-nav-reshuffle.context';
import { Node } from '@/types/node';
import { MOBILE_WIDTH_RESOLUTION } from '@/container/common/constants';
import useOnboarding, { ONBOARDING_OPENED_STATE_ENUM } from '../onboarding';
import rootTree from '@/container/nav-reshuffle/data/config/navigation/root';
import {
  initTree,
  findNodeById,
  initFeatureNames,
  findNodeByRouting,
} from '@/container/nav-reshuffle/sidebar/utils';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const ProductNavReshuffleProvider = ({
  children = null,
}: Props): JSX.Element => {
  const [currentNavigationNode, setCurrentNavigationNode] = useState<Node>(
    
    null,
  );
  const [currentUniverse, setCurrentUniverse] = useState<Node>(
    null,
  );
  const [selectedPciProjectId, setSelectedPciProjectId] = useState<string | null>(null);
  const [navigationTree, setNavigationTree] = useState(rootTree);
  const shell = useShell();
  const [isMobile, setIsMobile] = useState(
    useMediaQuery({
      query: `(max-width: ${MOBILE_WIDTH_RESOLUTION}px)`,
    }),
  );
  const skipToTheMainContentSlot = useRef(null);
  const [popoverPosition, setPopoverPosition] = useState<number>(0);
  const environment = shell.getPlugin('environment');
  const location = useLocation();

  /** Initialize navigation tree */
  useEffect(() => {
    const initializeNavigationTree = async () => {
      if (currentNavigationNode) return;
      const features = initFeatureNames(navigationTree);

      const results = await fetchFeatureAvailabilityData(features);

      const region = environment.getEnvironment().getRegion();
      const [tree] = initTree([navigationTree], results, region);

      const mxPlanNode = findNodeById(tree, 'mxplan');
      if (mxPlanNode && region === 'CA') {
        mxPlanNode.routing.hash = '#/email_mxplan';
      }
      setNavigationTree(tree);
    };
    initializeNavigationTree();
  }, []);

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
      if (window.innerWidth <= MOBILE_WIDTH_RESOLUTION) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!rootTree) return;
    const result = findNodeByRouting(rootTree, location.pathname);
    if (!result) return;
    setCurrentNavigationNode(result.node);
    setCurrentUniverse(result.universe);
  }, [location]);

  const pnrContext: ProductNavReshuffleContextType = {
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
    currentUniverse,
    setCurrentUniverse,
    navigationTree,
    isMobile,
    skipToTheMainContentSlot,
    popoverPosition,
    setPopoverPosition,
    selectedPciProjectId,
    setSelectedPciProjectId,
  };

  return (
    <ProductNavReshuffleContext.Provider value={pnrContext}>
      {children}
    </ProductNavReshuffleContext.Provider>
  );
};

export default ProductNavReshuffleProvider;
