import React, { useEffect } from 'react';
import { useShell } from '@ovh-ux/manager-react-shell-client';

import Router from './routes/Router';

function App() {
  const shell = useShell();
  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <React.Suspense fallback={<></>}>
      <Router />
    </React.Suspense>
  );
}

export default App;
