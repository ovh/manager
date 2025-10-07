type QueryStringValue = string | number | boolean | undefined | null;

/**
 * Builds a query string from an object of parameters.
 * It ignores undefined and null values.
 * It returns null if the object is empty or if all values are undefined or null.
 */
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
