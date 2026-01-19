import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useMemo } from 'react';
import { HELP_ROOT, HELP_INDEX_PATHS } from './useHelpLink.constants';
import { HelpPath } from './useHelpLink.type';

type Props = {
  paths?: HelpPath;
}
export default function useHelpLink({ paths }: Props = {}) {
  const shell = useContext(ShellContext);
  const region = shell.environment.getRegion();
  const { ovhSubsidiary } = shell.environment.getUser();

  return useMemo(() => {

    const helpPaths = paths ?? HELP_INDEX_PATHS;
    const path = helpPaths[region]?.[ovhSubsidiary];
    if (!path) {
      return HELP_ROOT;
    }
    if (path.startsWith('http')) {
      return path;
    }
    return `${HELP_ROOT}/${path}`;
  }, [region, ovhSubsidiary, paths]);
}
