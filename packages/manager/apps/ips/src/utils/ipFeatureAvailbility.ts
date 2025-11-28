import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useIpFeatureAvailability = () => {
  const context = useContext(ShellContext);
  const region = context.environment.getRegion();
  const allow = (...args: string[]) => {
    return Array.from(args).indexOf(region) > -1;
  };

  const deny = (...args: string[]) => {
    return Array.from(args).indexOf(region) === -1;
  };

  const showState = () => {
    return allow('US');
  };

  const allowIPFailoverImport = () => {
    return deny('US');
  };

  const allowIPFailoverOrder = () => {
    return deny('US');
  };

  const allowIPFailoverAgoraOrder = () => {
    return allow('US');
  };

  return {
    showState,
    allowIPFailoverImport,
    allowIPFailoverOrder,
    allowIPFailoverAgoraOrder,
    allow,
    deny,
  };
};
