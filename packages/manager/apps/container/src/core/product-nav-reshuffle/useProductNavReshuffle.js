import { useContext } from 'react';
import ProductNavReshuffleContext from './context';

export const useProductNavReshuffle = () => {
  return useContext(ProductNavReshuffleContext);
};

export default useProductNavReshuffle;
