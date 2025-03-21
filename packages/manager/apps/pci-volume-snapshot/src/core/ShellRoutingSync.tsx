import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ShellRoutingSync() {
  const location = useLocation();

  const { routing } = useContext(ShellContext).shell;
  useEffect(() => {
    routing.stopListenForHashChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    routing.onHashChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return null;
}
