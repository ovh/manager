import { createContext } from 'react';

export type ProgressContextType = {
  isStarted: boolean;
};

const ProgressContext = createContext<ProgressContextType>({
  isStarted: false,
});

export default ProgressContext;
