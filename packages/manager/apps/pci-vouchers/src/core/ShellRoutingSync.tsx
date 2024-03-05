import { useRouting } from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ShellRoutingSync() {
  const location = useLocation();
  const routing = useRouting();

  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);

  useEffect(() => {
    routing.onHashChange();
  }, [location]);

  return null;
}
