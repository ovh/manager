import { useQuery } from '@tanstack/react-query';

import { getManagedCmsReferenceAvailableLanguages } from '@/data/api/managedWordpress';

export const useManagedWordpressReferenceAvailableLanguages = () => {
  return useQuery({
    queryKey: ['get', 'managedCMS', 'reference', 'availsableLanguages'],
    queryFn: () => getManagedCmsReferenceAvailableLanguages(),
  });
};
