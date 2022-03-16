import { useContext } from 'react';
import ProductNavReshuffleContext from './context';

export const useProductNavReshuffle = () => {
  return useContext(ProductNavReshuffleContext);
};

export const useProductNavReshuffleOnboarding = () => {
  return useContext(ProductNavReshuffleContext).onboarding;
};

export default useProductNavReshuffle;
