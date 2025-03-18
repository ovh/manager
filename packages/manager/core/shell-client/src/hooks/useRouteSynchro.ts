import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '../ShellContext';

export const useRouteSynchro = () => {
  const location = useLocation();
  const { routing } = useContext(ShellContext).shell;

  useEffect(() => {
    routing.stopListenForHashChange();
  }, [routing]);

  useEffect(() => {
    routing.onHashChange();
  }, [location, routing]);
};

export default useRouteSynchro;
