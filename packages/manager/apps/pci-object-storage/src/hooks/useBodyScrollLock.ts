import { useEffect } from 'react';

/**
 * Custom hook to disable body scroll when drawer is open
 * This is a patch/workaround for the external @ovh-ux/manager-react-components Drawer
 * which doesn't handle body scroll locking internally, causing double scroll issues
 */
export const useBodyScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return () => null;
  }, [isOpen]);
};
