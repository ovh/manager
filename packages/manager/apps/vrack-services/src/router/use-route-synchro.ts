import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useRouteSynchro = () => {
  const location = useLocation();
  const {
    shell: { routing },
  } = React.useContext(ShellContext);

  React.useEffect(() => {
    routing.stopListenForHashChange();
  }, []);

  React.useEffect(() => {
    routing.onHashChange();
  }, [location]);
};
