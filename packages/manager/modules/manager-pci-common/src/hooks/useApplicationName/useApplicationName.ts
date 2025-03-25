import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  hasMetaProperty,
  InternalMeta,
  PCICommonContext,
  PCICommonMetaType,
} from '@/contexts/PCICommonContext/PCICommonContext';

function hasMetaApplicationName(
  meta: PCICommonMetaType,
): meta is Pick<Required<InternalMeta>, 'applicationName'> {
  return (
    hasMetaProperty(meta, 'applicationName') &&
    typeof meta.applicationName === 'string'
  );
}

export const useApplicationName = (): string | null => {
  const shellContext = useContext(ShellContext);
  const meta = useContext(PCICommonContext);

  if (hasMetaApplicationName(meta)) {
    return meta.applicationName;
  }
  if (shellContext) {
    return shellContext.environment.applicationName;
  }
  return null;
};
