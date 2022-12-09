import axios from 'axios';

let paths;

export const getApiPaths = async () => {
  if (paths) {
    return new Promise((resolve) => resolve(paths));
  }

  const response = await axios.get('https://api.ovh.com/1.0');
  return response.data.apis.map(({ path }) => path);
};

export default {
  getApiPaths,
};
