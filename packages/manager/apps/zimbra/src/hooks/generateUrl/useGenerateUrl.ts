import { RelativeRoutingType, useHref, useSearchParams } from 'react-router-dom';

import { buildURLWithSearchParams } from '@/utils';

export const useGenerateUrl = (
  baseURL: string,
  type: 'path' | 'href' = 'path',
  params?: Record<string, string | number>,
  relativeType: RelativeRoutingType = 'path',
) => {
  const [searchParams] = useSearchParams();

  const urlSearchParams = {
    organizationId: searchParams.get('organizationId'),
    ...params,
  };

  const fullURL = buildURLWithSearchParams({
    baseURL,
    searchParams: urlSearchParams,
  });

  const hrefUrl = useHref(fullURL, { relative: relativeType });

  return type === 'href' ? hrefUrl : fullURL;
};
