import { Environment } from '@ovh-ux/manager-config';
import { createContext } from 'react';

export const ShellContext = createContext({
  shell: null,
  environment: Environment,
});

export default ShellContext;
