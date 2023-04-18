import axios from 'axios';

export const getApiPaths = async () => {
  const response = await axios.get('https://api.ovh.com/1.0');
  return response.data.apis.map(({ path }) => path);
};

export default {
  getApiPaths,
};
