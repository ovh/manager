import { RelativeRoutingType, useHref, useSearchParams } from 'react-router-dom';

import { buildURLWithSearchParams } from '@/utils';

export const useGenerateUrl = (
  baseURL: string,
  type: 'path' | 'href' = 'path',
  params?: Record<string, string | number>,
  relativeType: RelativeRoutingType = 'path',
): string => {
  const [searchParams] = useSearchParams();

  const urlSearchParams = {
    serviceName: searchParams.get('serviceName') ?? undefined,
    ...params,
  };

  const fullURL = buildURLWithSearchParams({
    baseURL,
    searchParams: urlSearchParams,
  });

  const href = useHref(fullURL, { relative: relativeType });

  return type === 'href' ? href : fullURL;
};
