import { useHref } from 'react-router-dom';

export const UseGenerateUrl = (
  baseURL: string,
  type: 'path' | 'href' = 'path',
  params?: Record<string, string | number>,
) => {
  const URL = baseURL.replace(
    ':serviceName',
    (params?.serviceName as string) || '',
  );

  if (type === 'href') {
    return useHref(URL);
  }
  return URL;
};
