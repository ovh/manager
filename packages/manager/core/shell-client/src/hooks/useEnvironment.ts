import { useContext } from 'react';

import { ShellContext } from '../ShellContext';

/**
 * @deprecated use ShellContext directly
 */
export function useEnvironment() {
  const { environment } = useContext(ShellContext);
  return environment;
}

export default useEnvironment;
