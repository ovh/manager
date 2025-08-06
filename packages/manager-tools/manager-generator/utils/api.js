import axios from 'axios';

const v2Endpoint = 'https://eu.api.ovh.com/v2';
const v6Endpoint = 'https://api.ovh.com/1.0';

const v2Prefix = 'v2-';
const v6Prefix = 'v6-';

export const isV2Endpoint = (apiPath) => apiPath?.startsWith(v2Prefix);

export const removeApiVersionPrefix = (apiPath) =>
  apiPath.substring(v2Prefix.length);

/**
 * @returns the list of API v6 and v2 services endpoints
 */
export const getApiPaths = async () => {
  const v2response = await axios.get(v2Endpoint);
  const v6response = await axios.get(v6Endpoint);

  return [
    {
      type: 'separator',
      line: `V2 endpoints from ${v2response.data.basePath}`,
    },
    { type: 'separator' },
    ...v2response.data.apis.map(({ path }) => ({
      name: path,
      value: `${v2Prefix}${path}`,
    })),
    { type: 'separator' },
    {
      type: 'separator',
      line: `V6 endpoints from ${v6response.data.basePath}`,
    },
    { type: 'separator' },
    ...v6response.data.apis.map(({ path }) => ({
      name: path,
      value: `${v6Prefix}${path}`,
    })),
    { type: 'separator' },
  ];
};

/**
 * @returns the list of API operations of a specific service
 */
export const getApiServiceOperations = async (apiPath) => {
  const endpoint = isV2Endpoint(apiPath) ? v2Endpoint : v6Endpoint;
  const response = await axios.get(
    `${endpoint}${removeApiVersionPrefix(apiPath)}.json`,
  );
  return response.data.apis;
};
