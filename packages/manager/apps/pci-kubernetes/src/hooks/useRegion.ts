import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';

const useIsUsRegion = () => {
  const context = useContext(ShellContext);
  const region = context.environment.getRegion();
  return region === 'US';
};

export default useIsUsRegion;
