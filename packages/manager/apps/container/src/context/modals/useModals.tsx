import { useContext } from 'react';
import ModalsContext from '@/context/modals/modals.context';

const useModals = () => useContext(ModalsContext);

export default useModals;
