import { useContext } from 'react';
import ContainerContext from './context';

const useContainer = () => {
  return useContext(ContainerContext);
};

export default useContainer;
