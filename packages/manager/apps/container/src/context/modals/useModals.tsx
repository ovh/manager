import { useContext } from 'react';
import ModalsContext from '@/context/modals/modals.context';

const useModals = () => {
  const context = useContext(ModalsContext);
  if (!context) throw new Error('useModals must be inside ModalsProvider');
  return context;
};

export default useModals;
