import React from 'react';
import { useLocation } from 'react-router-dom';
import { useRouting } from '@ovh-ux/manager-react-shell-client';

export const useRouteSynchro = () => {
  const location = useLocation();
  const routing = useRouting();

  React.useEffect(() => {
    routing.stopListenForHashChange();
  }, []);

  React.useEffect(() => {
    routing.onHashChange();
  }, [location]);
};
