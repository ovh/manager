import { createContext, MutableRefObject } from 'react';
import { Node } from '@/types/node';

export type ProductNavReshuffleContextType = {
  isAccountSidebarOpened: boolean;
  onboardingOpenedState: string;
  isNavigationSidebarOpened: boolean;
  currentNavigationNode: Node;
  currentUniverse: Node;
  navigationTree: Node;
  isMobile: boolean;
  popoverPosition: number;
  selectedPciProjectId: string | null;
  skipToTheMainContentSlot: MutableRefObject<any>,
  startOnboarding: () => void;
  openOnboarding: () => void;
  closeOnboarding: (isDone?: boolean) => void;
  reduceOnboarding: () => void;
  openAccountSidebar: () => void;
  closeAccountSidebar: () => void;
  openNavigationSidebar: () => void;
  closeNavigationSidebar: () => void;
  setCurrentNavigationNode: (node: Node) => void;
  setCurrentUniverse: (node: Node) => void;
  setPopoverPosition: (value: number) => void;
  setSelectedPciProjectId: (projectId: string | null) => void;
};

const ProductNavReshuffleContext = createContext<ProductNavReshuffleContextType | null>(
  null,
);

export default ProductNavReshuffleContext;
