import { useContext } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { createHelpUrlMap } from '@/commons/utils/create-help-url-map/CreateHelpUrlMap';

import { HELP_LOCALES, HELP_ROOT, USA_HELP_ROOT } from './useHelpLink.constant';

const HELP_LINKS = createHelpUrlMap(HELP_ROOT, {
  paths: HELP_LOCALES,
  overrides: {
    US: USA_HELP_ROOT,
  },
});

export const useHelpLink = () => {
  const shell = useContext(ShellContext);
  const { ovhSubsidiary } = shell.environment.getUser();

  return (ovhSubsidiary && HELP_LINKS[ovhSubsidiary]) || HELP_ROOT;
};
