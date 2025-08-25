import { useContext } from 'react';

import { ShellContext } from '../ShellContext';

/**
 * @deprecated use ShellContext directly
 */
export const useRouting = () => {
  const { shell } = useContext(ShellContext);

  return shell.routing;
};

export default useRouting;
