import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useShellRoutingSync = () => {
  const location = useLocation();
  const { routing } = useContext(ShellContext).shell;

  useEffect(() => {
    routing.stopListenForHashChange();
  }, [routing]);

  useEffect(() => {
    routing.onHashChange();
  }, [location, routing]);
};
