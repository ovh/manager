import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ShellRoutingSync(): any {
  const location = useLocation();

  const { routing } = useContext(ShellContext).shell;
  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    routing.onHashChange();
  }, [location]);
  return null;
}
