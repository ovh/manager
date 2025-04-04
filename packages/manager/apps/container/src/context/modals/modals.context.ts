import { createContext } from 'react';

export type ModalsContextType = {
  data: any;
};

const ModalsContext = createContext<ModalsContextType>({} as ModalsContextType);

export default ModalsContext;
