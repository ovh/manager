import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { GuideContext, GuideName } from '@/contexts/GuideContext/GuideContext';

export const useGuide = (guideName: GuideName): string => {
  const guides = useContext(GuideContext);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  return useMemo(() => {
    if (guides[ovhSubsidiary][guideName])
      return guides[ovhSubsidiary][guideName];

    // Fallback to FR subsidiary for French-speaking countries
    if (
      ['MA', 'TN', 'SN', 'QC'].includes(ovhSubsidiary) &&
      guides.FR[guideName]
    )
      return guides.FR[guideName];

    // Fallback to World Spanish for Spanish-speaking countries
    if (['WS'].includes(ovhSubsidiary) && guides.ES[guideName])
      return guides.ES[guideName];

    // Fallback to Ireland for european countries
    if (
      ['DE', 'ES', 'FR', 'IT', 'NL', 'PT', 'PL'].includes(ovhSubsidiary) &&
      (guides.IE[guideName] || guides.GB[guideName])
    )
      return guides.IE[guideName] ?? guides.GB[guideName];

    // Else fallback to World English or throw since we don't know what to do in this case
    if (guides.WE[guideName]) return guides.WE[guideName];

    throw new Error('Guide not found');
  }, [ovhSubsidiary]);
};
