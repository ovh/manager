import { useContext } from 'react';

import { ShellContext, ShellContextType } from '../ShellContext';

/**
 * @deprecated use ShellContext directly
 */
export function useShell(): ShellContextType['shell'] {
  const { shell } = useContext(ShellContext);
  return shell;
}

export default useShell;
