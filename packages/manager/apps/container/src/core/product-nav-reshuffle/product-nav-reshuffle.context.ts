import { createContext, MutableRefObject } from 'react';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';

export type ProductNavReshuffleContextType = {
  isAccountSidebarOpened: boolean;
  onboardingOpenedState: string;
  isNavigationSidebarOpened: boolean;
  currentNavigationNode: Node;
  navigationTree: Node;
  isMobile: boolean;
  isAnimated: boolean;
  isFirstTabDone: boolean,
  firstFocusableElement: MutableRefObject<any>,
  setIsFirstTabDone: (isFirstTabDone: boolean) => void,
  startOnboarding: () => void;
  openOnboarding: () => void;
  closeOnboarding: (isDone?: boolean) => void;
  reduceOnboarding: () => void;
  openAccountSidebar: () => void;
  closeAccountSidebar: () => void;
  openNavigationSidebar: () => void;
  closeNavigationSidebar: () => void;
  setCurrentNavigationNode: (node: Node) => void;
  setNavigationTree: (tree: Node) => void;
  setIsAnimated: (isAnimated: boolean) => void;
};

const ProductNavReshuffleContext = createContext<ProductNavReshuffleContextType | null>(
  null,
);

export default ProductNavReshuffleContext;
