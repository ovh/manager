import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShell } from '.';

export default function OvhContainerRoutingSync(): JSX.Element {
  const location = useLocation();

  const shell = useShell();
  useEffect(() => {
    shell.routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    shell.routing.onHashChange();
  }, [location]);
  return undefined;
}
