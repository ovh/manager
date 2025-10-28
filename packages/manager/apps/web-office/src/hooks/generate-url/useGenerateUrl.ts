import { useHref } from 'react-router-dom';

export const useGenerateUrl = (
  baseURL: string,
  type: 'path' | 'href' = 'path',
  params?: Record<string, string | number>,
) => {
  const URL = baseURL.replace(':serviceName', (params?.serviceName as string) || '');

  const queryParams = {
    ...params,
  };

  const queryString = Object.entries(queryParams)
    .filter(([key]) => key !== 'serviceName')
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const fullURL = queryString ? `${URL}?${queryString}` : URL;
  const href = useHref(fullURL);

  if (type === 'href') {
    return href;
  }
  return fullURL;
};
