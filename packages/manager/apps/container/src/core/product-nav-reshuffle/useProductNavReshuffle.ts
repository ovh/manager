import { useContext } from 'react';
import ProductNavReshuffleContext, {
  ProductNavReshuffleContextType,
} from './context';

const useProductNavReshuffle = (): ProductNavReshuffleContextType => {
  return useContext(ProductNavReshuffleContext);
};

export default useProductNavReshuffle;
