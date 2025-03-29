import { createContext } from 'react';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';
import { MutableRefObject } from 'react';

export type ProductNavReshuffleContextType = {
  isAccountSidebarOpened: boolean;
  onboardingOpenedState: string;
  isNavigationSidebarOpened: boolean;
  currentNavigationNode: Node;
  navigationTree: Node;
  isMobile: boolean;
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
  isFirstTabDone: boolean;
  setIsFirstTabDone: (isFirstTabDone: boolean) => void;
  firstFocusableElement: MutableRefObject<any>;
};

const ProductNavReshuffleContext = createContext<
  ProductNavReshuffleContextType
>({} as ProductNavReshuffleContextType);

export default ProductNavReshuffleContext;
