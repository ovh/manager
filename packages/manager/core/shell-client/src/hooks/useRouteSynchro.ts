import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '../ShellContext';

export const useRouteSynchro = () => {
  const location = useLocation();
  const { shell } = useContext(ShellContext);

  useEffect(() => {
    shell?.routing.stopListenForHashChange();
  }, [shell?.routing]);

  useEffect(() => {
    shell?.routing.onHashChange();
  }, [location, shell?.routing]);
};

export default useRouteSynchro;
