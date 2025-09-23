import { PropsWithChildren } from 'react';

export type DrawerBaseProps = PropsWithChildren & {
  /** Open/close the drawer (default to true) */
  isOpen?: boolean;
  /** Callback function to be called on close of the Drawer */
  onDismiss: () => void;
  /** Show a loader instead of the drawer content  */
  isLoading?: boolean;
  /** Class name for the drawer */
  className?: string;
};
