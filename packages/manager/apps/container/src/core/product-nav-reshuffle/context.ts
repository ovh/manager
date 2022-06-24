import { createContext } from 'react';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';

export type ProductNavReshuffleContextType = {
  isLoading: boolean;
  isAccountSidebarOpened: boolean;
  onboardingOpenedState: string;
  isNavigationSidebarOpened: boolean;
  currentNavigationNode: Node;
  navigationTree: Node;
  getFeedbackUrl: () => string;
  openOnboarding: () => void;
  startOnboarding: () => void;
  closeOnboarding: (onboardingStatus?: string) => void;
  reduceOnboarding: () => void;
  openAccountSidebar: () => void;
  closeAccountSidebar: () => void;
  openNavigationSidebar: () => void;
  closeNavigationSidebar: () => void;
  setCurrentNavigationNode: (node: Node) => void;
  setNavigationTree: (tree: Node) => void;
};

const ProductNavReshuffleContext = createContext<
  ProductNavReshuffleContextType
>({} as ProductNavReshuffleContextType);

export default ProductNavReshuffleContext;
