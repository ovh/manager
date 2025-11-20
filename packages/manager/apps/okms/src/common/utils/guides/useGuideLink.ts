import { useShellContext } from '@/common/hooks/useShellContext';

import { GuideLinks } from './guideLinks.type';

export const useGuideLink = (guideLinks: GuideLinks) => {
  const { environment } = useShellContext();
  const { ovhSubsidiary } = environment.getUser();

  return guideLinks[ovhSubsidiary] ?? guideLinks.GB ?? '';
};
