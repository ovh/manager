import { useMemo } from 'react';
import { Region, Subsidiary } from '@ovh-ux/manager-config';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { DEFAULT_SUB_BY_REGION, MORE_INFO_LINK } from '@/constants/constants';
import { useLink } from '@/hooks/links/useLinks';

export const useDataUsageInfoLink = (
  region: Region,
  subsidiary?: Subsidiary,
) => {
  const standardizedSubsidiary = useMemo(() => {
    if (subsidiary === undefined) {
      return DEFAULT_SUB_BY_REGION[region];
    }
    if (subsidiary in OvhSubsidiary) {
      return subsidiary as OvhSubsidiary;
    }
    return OvhSubsidiary.DEFAULT;
  }, [subsidiary]);
  return useLink(MORE_INFO_LINK, standardizedSubsidiary);
};
