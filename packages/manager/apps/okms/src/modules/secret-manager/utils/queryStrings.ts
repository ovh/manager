type QueryStringValue = string | number | boolean | undefined | null;

export const buildQueryString = (params: Record<string, QueryStringValue>) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.set(key, String(value));
    }
  });
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : null;
};
