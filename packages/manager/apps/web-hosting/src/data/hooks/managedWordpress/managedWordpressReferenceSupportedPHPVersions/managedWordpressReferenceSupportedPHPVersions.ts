import { useQuery } from '@tanstack/react-query';

import { getManagedCmsSupportedPHPVersions } from '@/data/api/managedWordpress';

export const useManagedCmsLatestPhpVersion = () => {
  return useQuery({
    queryKey: ['get', 'managedCMS', 'reference', 'supportedPHPVersions'],
    queryFn: getManagedCmsSupportedPHPVersions,
  });
};
