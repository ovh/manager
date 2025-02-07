import { useContext } from 'react';
import { Context, ContextDatagridType } from './DatagridContext.provider';
import { TIPRestrictionsData } from '@/types';

const useDataGridContext = () => {
  const context = useContext(Context) as ContextDatagridType<
    TIPRestrictionsData[]
  >;
  if (context === undefined) {
    throw new Error(
      'useDataGridContext must be used within a DatagridProvider',
    );
  }
  return context;
};

export default useDataGridContext;
