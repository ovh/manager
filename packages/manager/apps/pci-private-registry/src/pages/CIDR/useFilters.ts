import { useContext } from 'react';
import { Context } from './FilterContext.provider';

const useFilter = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export default useFilter;
