import { useHref } from 'react-router-dom';

/**
 * Generates a URL based on a base URL, a type, and optional parameters.
 * The hook can generate either a path or a full URL with query parameters.
 * @param {string} baseURL - The base URL, which may contain a :serviceName placeholder.
 * @param {'path' | 'href'} [type='path'] - The type of URL to generate ('path' or 'href').
 * @param {Record<string, string | number>} [params] - Optional parameters to replace placeholders or add as query parameters.
 * @returns {string} - The generated URL or path.
 */
export const useGenerateUrl = (
  baseURL: string,
  type: 'path' | 'href' = 'path',
  params?: Record<string, string | number>,
) => {
  const URL = baseURL.replace(
    ':serviceName',
    (params?.serviceName as string) || '',
  );

  const queryParams = {
    ...params,
  };

  const queryString = Object.entries(queryParams)
    .filter(([key]) => key !== 'serviceName')
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const fullURL = queryString ? `${URL}?${queryString}` : URL;

  if (type === 'href') {
    return useHref(fullURL);
  }
  return fullURL;
};
