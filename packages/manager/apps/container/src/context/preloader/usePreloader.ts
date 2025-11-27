import { useContext } from 'react';

import PreloaderContext, { PreloaderContextType } from './preloader.context';

const usePreloader = (): PreloaderContextType => {
  const preloaderContext = useContext(PreloaderContext);
  if (!preloaderContext) {
    throw new Error('usePreloader must be used within a PreloaderProvider');
  }

  return preloaderContext;
};

export default usePreloader;
