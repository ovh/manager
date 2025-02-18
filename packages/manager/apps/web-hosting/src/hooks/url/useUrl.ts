import { RelativeRoutingType, useHref } from 'react-router-dom';

export const useUrl = (
  baseURL: string,
  params: Record<string, string | number> = {},
  relativeType: RelativeRoutingType | null = null,
) => {
  const url = `${baseURL}${Object.entries(params)
    .map(([key, value], index) => `${index === 0 ? '?' : ''}${key}=${value}`)
    .join('&')}`;

  if (relativeType) {
    return useHref(url, { relative: relativeType });
  }

  return url;
};

export default useUrl;
