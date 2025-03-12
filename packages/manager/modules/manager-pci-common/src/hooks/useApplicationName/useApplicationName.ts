import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { PCICommonContext } from '@/contexts/PCICommonContext/PCICommonContext';

export const useApplicationName = (): string => {
  const shellContext = useContext(ShellContext);
  const meta = useContext(PCICommonContext);

  if (
    meta &&
    'applicationName' in meta &&
    typeof meta.applicationName === 'string'
  ) {
    return meta.applicationName;
  }
  if (shellContext) {
    return shellContext.environment.applicationName;
  }
  return 'public-cloud';
};
