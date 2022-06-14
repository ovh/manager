import { useContext } from 'react';

import ProgressContext, { ProgressContextType } from './progress.context';

const useHeader = (): ProgressContextType => {
  return useContext(ProgressContext);
};

export default useHeader;
