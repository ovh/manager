import { useContext } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useNavigation = () => {
  const { shell } = useContext(ShellContext);

  return shell?.navigation;
};
