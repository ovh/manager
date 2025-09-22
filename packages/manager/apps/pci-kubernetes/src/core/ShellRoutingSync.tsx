import { useContext, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export default function ShellRoutingSync() {
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
