import { useRouteSynchro } from '@ovh-ux/manager-react-shell-client';

/**
 * Hook to synchronize React Router state with Shell routing
 * Extracted from Main.layout.tsx for reusability and testability
 */
export function useShellRoutingSync() {
  useRouteSynchro();
  return null;
}

