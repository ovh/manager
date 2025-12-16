import { useQuery } from '@tanstack/react-query';

import { getModuleDetails, getModuleList } from '@/data/api/webHostingModule';
import { CmsType } from '@/data/types/product/managedWordpress/cms';

const CMS_TO_MODULE_NAME: Record<CmsType, string> = {
  [CmsType.WORDPRESS]: 'wordpress',
  [CmsType.PRESTASHOP]: 'prestashop',
  [CmsType.DRUPAL]: 'drupal',
  [CmsType.JOOMLA]: 'joomla',
  [CmsType.NONE]: '',
};

export const useGetModuleLanguages = (cmsType: CmsType | null | undefined) => {
  const enabled = Boolean(cmsType && cmsType !== CmsType.NONE);

  return useQuery<string[]>({
    queryKey: ['hosting', 'web', 'moduleLanguages', cmsType],
    enabled,
    queryFn: async () => {
      if (!cmsType || cmsType === CmsType.NONE) {
        return [];
      }

      const targetName = CMS_TO_MODULE_NAME[cmsType]?.toLowerCase();
      if (!targetName) {
        return [];
      }

      // Get only active & latest modules to minimise the number of entries
      const moduleIds = await getModuleList(true, true);
      if (!moduleIds?.length) {
        return [];
      }

      const moduleDetails = await Promise.all(moduleIds.map((id) => getModuleDetails(id)));

      const matchingModule = moduleDetails.find(
        (details) => details.name.toLowerCase() === targetName && details.latest && details.active,
      );

      return matchingModule?.language ?? [];
    },
  });
};
