import { useContext } from 'react';
import ContainerContext from './container.context';

const useContainer = () => {
  const containerContext = useContext(ContainerContext);
  if (!containerContext) {
    throw new Error('useContainer must be used within a ContainerProvider');
  }
  return containerContext;
};

export default useContainer;
