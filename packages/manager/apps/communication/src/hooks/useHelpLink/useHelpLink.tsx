import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useMemo } from 'react';
import { HELP_ROOT, HELP_URL } from './useHelpLink.constants';

export default function useHelpLink() {
  const shell = useContext(ShellContext);
  const region = shell.environment.getRegion();
  const { ovhSubsidiary } = shell.environment.getUser();

  return useMemo(() => {
    return HELP_URL[region]?.[ovhSubsidiary] ?? HELP_ROOT;
  }, [region, ovhSubsidiary]);
}
