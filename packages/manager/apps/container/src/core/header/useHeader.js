import { useContext } from 'react';
import HeaderContext from './header.context';

const useHeader = () => {
  return useContext(HeaderContext);
};

export default useHeader;
