import { useHref } from 'react-router-dom';

/**
 * Generates a URL based on a base URL, a type, and optional parameters.
 * The hook can generate either a path or a full URL with query parameters.
 * @param {string} baseURL - The base URL, which may contain placeholders like :serviceName.
 * @param {'path' | 'href'} [type='path'] - The type of URL to generate ('path' or 'href').
 * @param {Record<string, string | number>} [pathParams] - Optional parameters to replace URL placeholders.
 * @param {Record<string, string | number>} [queryParams] - Optional parameters to add as query parameters.
 * @returns {string} - The generated URL or path.
 */
export const useGenerateUrl = (
  baseURL: string,
  type: 'path' | 'href' = 'path',
  pathParams?: Record<string, string | number>,
  queryParams?: Record<string, string | number>,
) => {
  let URL = baseURL;
  for (const [key, value] of Object.entries(pathParams || {})) {
    URL = URL.replace(`:${key}`, (value as string) || '');
  }

  if (queryParams) {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    if (queryString) {
      URL = `${URL}?${queryString}`;
    }
  }

  if (type === 'href') {
    return useHref(URL);
  }
  return URL;
};
