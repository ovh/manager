import { RelativeRoutingType, useHref } from 'react-router-dom';
import { useOrganization } from '@/hooks';

export const useGenerateUrl = (
  baseURL: string,
  type: 'path' | 'href' = 'path',
  params?: Record<string, string | number>,
  relativeType: RelativeRoutingType = 'path',
) => {
  const { data: organization } = useOrganization();

  const queryParams = {
    ...params,
    ...(organization?.id && { organizationId: organization.id }),
  };

  const fullURL = `${baseURL}${Object.entries(queryParams)
    .map(([key, value], index) => `${index === 0 ? '?' : ''}${key}=${value}`)
    .join('&')}`;

  if (type === 'href') {
    return useHref(fullURL, { relative: relativeType });
  }
  return fullURL;
};
