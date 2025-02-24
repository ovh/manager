import React, { useEffect } from 'react';
import { useShell } from '@ovh-ux/manager-react-shell-client';

// import '@ovhcloud/ods-theme-blue-jeans';
// import './global.css';

import Router from './routes/Router';
import Loading from './components/loading/Loading.component';
// import { useLoadingIndicatorContext } from './contexts/LoadingIndicator.context';
// import ProgressLoader from './components/loading/ProgressLoader.component';

function App() {
  // const { loading } = useLoadingIndicatorContext();
  const shell = useShell();
  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <React.Suspense fallback={<Loading />}>
      <Router />
    </React.Suspense>
  );
}

export default App;
