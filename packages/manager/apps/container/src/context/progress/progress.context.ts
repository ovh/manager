import { createContext } from 'react';

export type ProgressContextType = {
  isStarted: boolean;
};

const ProgressContext = createContext<ProgressContextType | null>({
  isStarted: false,
});

export default ProgressContext;
