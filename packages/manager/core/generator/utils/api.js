import axios from 'axios';
/**
 * @returns the list of API v6 services endpoints
 */
export const getApiPaths = async () => {
  const response = await axios.get('https://api.ovh.com/1.0');
  return response.data.apis.map(({ path }) => path);
};

/**
 * @returns the list of API v6 operations of a specific service
 */
export const getApiServiceOperations = async (apiPath) => {
  const response = await axios.get(`https://api.ovh.com/1.0${apiPath}.json`);
  return response.data.apis;
};

export default {
  getApiPaths,
  getApiServiceOperations,
};
