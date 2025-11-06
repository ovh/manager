import { useMatch } from 'react-router-dom';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { urls } from '@/alldoms/routes/routes.constant';

export const useCloseModal = (serviceName: string, url: string) => {
  const isListingTerminate = !!useMatch(url);
  const closeUrl = useGenerateUrl(
    isListingTerminate ? urls.alldomsRoot : urls.alldomsDetail,
    'path',
    isListingTerminate ? {} : { serviceName },
  );

  return closeUrl;
};
