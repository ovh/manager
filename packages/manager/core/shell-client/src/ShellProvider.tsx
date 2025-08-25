import { ReactNode } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import { ShellClientApi } from '@ovh-ux/shell';

import { ShellContext } from './ShellContext';

/**
 * @deprecated use ShellContext directly
 */
export const ShellProvider = ({
  client,
  children,
}: {
  client: {
    shell: ShellClientApi;
    environment: Environment;
  };
  children: ReactNode;
}) => {
  return <>{client && <ShellContext.Provider value={client}>{children}</ShellContext.Provider>}</>;
};

export default ShellProvider;
