import { useHref } from 'react-router-dom';
import { useOrganization } from '@/hooks';

export const useGenerateUrl = (
  baseURL: string,
  type: 'path' | 'href' = 'path',
  params?: Record<string, string | number>,
) => {
  const { data: organization } = useOrganization();

  const queryParams = {
    ...params,
    ...(organization?.id && { organizationId: organization.id }),
  };

  const fullURL = `${baseURL}?${Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`;

  if (type === 'href') {
    return useHref(fullURL);
  }
  return fullURL;
};
