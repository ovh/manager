import { useContext } from 'react';

import { ShellContext } from '../ShellContext';

/**
 * @deprecated use ShellContext directly
 */
export function useShell() {
  const { shell } = useContext(ShellContext);
  return shell;
}

export default useShell;
