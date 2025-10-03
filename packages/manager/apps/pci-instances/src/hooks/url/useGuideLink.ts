import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { GUIDE_LINKS } from './useGuideLink.constant';

export const useGuideLink = (name: keyof typeof GUIDE_LINKS) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const guideLink = GUIDE_LINKS[name];

  return guideLink[ovhSubsidiary] ?? guideLink.DEFAULT;
};
