import {
  RelativeRoutingType,
  useHref,
  useSearchParams,
} from 'react-router-dom';
import { buildURLWithSearchParams } from '@/utils';

export const useGenerateUrl = (
  baseURL: string,
  type: 'path' | 'href' = 'path',
  params?: Record<string, string | number>,
  relativeType: RelativeRoutingType = 'path',
) => {
  const [searchParams] = useSearchParams();

  const urlSearchParams = {
    serviceName: searchParams.get('serviceName'),
    ...params,
  };

  const fullURL = buildURLWithSearchParams({
    baseURL,
    searchParams: urlSearchParams,
  });

  if (type === 'href') {
    return useHref(fullURL, { relative: relativeType });
  }
  return fullURL;
};
