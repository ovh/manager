import { useRouteError } from 'react-router-dom';
import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';

const GlobalErrorHandler = () => {
  const error = useRouteError();
  return (
    <>
      <h1>Error</h1>
      {error && JSON.stringify(error)}
      <ShellRoutingSync />
      <HidePreloader />
    </>
  );
};

export default GlobalErrorHandler;
