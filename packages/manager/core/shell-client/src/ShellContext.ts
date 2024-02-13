import { Environment } from '@ovh-ux/manager-config';
import { ShellClientApi } from '@ovh-ux/shell';
import { createContext } from 'react';

export type ShellContextType = {
  shell: ShellClientApi;
  environment: Environment;
};

export const ShellContext = createContext<ShellContextType>({
  shell: null,
  environment: null,
});

export default ShellContext;
