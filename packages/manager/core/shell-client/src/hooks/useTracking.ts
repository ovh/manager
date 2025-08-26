import { useContext } from 'react';

import { ShellContext } from '../ShellContext';

/**
 * @deprecated use ShellContext directly
 */
export const useTracking = () => {
  const { shell } = useContext(ShellContext);

  return shell?.tracking;
};

export default useTracking;
