import { useContext } from 'react';
import ProductNavReshuffleContext, {
  ProductNavReshuffleContextType,
} from './product-nav-reshuffle.context';

const useProductNavReshuffle = (): ProductNavReshuffleContextType => {
  const productNavReshuffleContext = useContext(ProductNavReshuffleContext);
  if (!productNavReshuffleContext) {
    throw new Error(
      'useProductNavReshuffle must be used within a ProductNavReshuffleProvider',
    );
  }
  return productNavReshuffleContext;
};

export default useProductNavReshuffle;
