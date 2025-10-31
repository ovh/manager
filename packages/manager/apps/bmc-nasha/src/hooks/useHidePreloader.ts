import { useContext, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

/**
 * Hook to hide the shell preloader
 * Extracted from Main.layout.tsx for reusability and testability
 */
export function useHidePreloader() {
  const { shell } = useContext(ShellContext);

  useEffect(() => {
    shell?.ux.hidePreloader();
  }, [shell]);
}

