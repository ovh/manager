import { createContext } from 'react';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';

export type ProductNavReshuffleContextType = {
  isAccountSidebarOpened: boolean;
  onboardingOpenedState: string;
  isNavigationSidebarOpened: boolean;
  currentNavigationNode: Node;
  navigationTree: Node;
  isMobile: boolean;
  isAnimated: boolean;
  popoverPosition: number;
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
  setPopoverPosition: (value: number) => void;
};

const ProductNavReshuffleContext = createContext<ProductNavReshuffleContextType | null>(
  null,
);

export default ProductNavReshuffleContext;
