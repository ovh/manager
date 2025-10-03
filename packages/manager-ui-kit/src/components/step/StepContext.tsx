import { createContext } from 'react';
import { StepProps } from './Step.props';

export const StepContext = createContext<StepProps>({
  open: true,
  checked: false,
  locked: false,
  order: 0,
});

export default StepContext;
