import { useContext } from 'react';

import ProgressContext, { ProgressContextType } from './progress.context';

const useProgress = (): ProgressContextType => {
  const progressContext = useContext(ProgressContext);
  if (!progressContext) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }

  return progressContext;
};

export default useProgress;
