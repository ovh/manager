import { useContext } from 'react';
import ProductNavReshuffleContext from './context';

const useProductNavReshuffle = () => {
  return useContext(ProductNavReshuffleContext);
};

export default useProductNavReshuffle;
