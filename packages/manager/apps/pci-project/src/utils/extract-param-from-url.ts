/**
 * Extracts a specific parameter value from a URL, checking both query parameters and hash fragments.
 *
 * This function attempts to extract a parameter value from:
 * 1. Standard URL query parameters (e.g., ?param=value)
 * 2. Hash fragment query parameters (e.g., #/path?param=value)
 *
 * @param params - Object containing the URL and parameter name
 * @param params.url - The URL string to parse
 * @param params.paramName - The name of the parameter to extract
 * @returns The parameter value if found, null otherwise
 *
 */
const extractParamFromUrl = ({
  url,
  paramName,
}: {
  url: string;
  paramName: string;
}): string | null => {
  if (!url || !paramName) {
    return null;
  }

  try {
    const urlObject = new URL(url);

    // First try to get from standard query parameters
    const queryParam = urlObject.searchParams.get(paramName);
    if (queryParam) {
      return queryParam;
    }

    // If not found and there's a hash with parameters, try parsing the hash
    if (urlObject.hash) {
      const hashQueryString = urlObject.hash.split('?')[1];
      if (hashQueryString) {
        const hashParams = new URLSearchParams(hashQueryString);
        const hashParam = hashParams.get(paramName);
        if (hashParam) {
          return hashParam;
        }
      }
    }

    return null;
  } catch (error) {
    // Invalid URL format
    return null;
  }
};

export default extractParamFromUrl;
