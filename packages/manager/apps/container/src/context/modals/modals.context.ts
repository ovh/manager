import { createContext } from 'react';

export type ModalsContextType = {
  data: unknown;
};

const ModalsContext = createContext<ModalsContextType>({} as ModalsContextType);

export default ModalsContext;
