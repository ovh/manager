import React from 'react';

import { useLocation } from 'react-router-dom';

import { ShellContext } from '../ShellContext';

export const useRouteSynchro = () => {
  const location = useLocation();
  const { shell } = React.useContext(ShellContext);

  React.useEffect(() => {
    shell?.routing?.stopListenForHashChange();
  }, []);

  React.useEffect(() => {
    shell?.routing?.onHashChange();
  }, [location]);
};

export default useRouteSynchro;
