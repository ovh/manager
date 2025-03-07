import { createContext } from 'react';

export type ProgressContextType = {
  isStarted: boolean;
};

// set to default null to prevent false-positives outside of the provider
const ProgressContext = createContext<ProgressContextType | null>(null);

export default ProgressContext;
