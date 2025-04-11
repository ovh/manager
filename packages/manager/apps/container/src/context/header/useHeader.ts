import { useContext } from 'react';
import HeaderContext, { HeaderContextType } from './header.context';

const useHeader = (): HeaderContextType => {
  const headerContext = useContext(HeaderContext);
  if (!headerContext) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }

  return headerContext;
};

export default useHeader;
