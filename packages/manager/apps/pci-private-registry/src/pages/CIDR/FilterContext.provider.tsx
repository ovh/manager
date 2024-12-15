import {
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import { createContext } from 'react';

const Context = createContext<
  ReturnType<typeof useColumnFilters> & ReturnType<typeof useDataGrid>
>(null);

const FilterProvider = ({ children }: { children: JSX.Element }) => {
  const dataGrid = useDataGrid();
  const columnFilters = useColumnFilters();

  return (
    <Context.Provider value={{ ...dataGrid, ...columnFilters }}>
      {children}
    </Context.Provider>
  );
};

export { Context, FilterProvider };
