import { useContext } from 'react';

import { ShellContext } from '../ShellContext';

/**
 * @deprecated use ShellContext directly
 */
export const useNavigation = () => {
  const { shell } = useContext(ShellContext);

  return shell?.navigation;
};

export default useNavigation;
