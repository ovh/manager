import { useContext } from 'react';

import HeaderContext, { HeaderContextType } from './header.context';

const useHeader = (): HeaderContextType => {
  return useContext(HeaderContext);
};

export default useHeader;
