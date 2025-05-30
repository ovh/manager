import axios from 'axios';
import { User } from '@ovh-ux/manager-config';
import { getHeaders } from '@ovh-ux/request-tagger';

const baseURL = '/engine/apiv6';
const endpointPath = '/me';

// We use a dedicated axios instance in order to bypass the redirection to login page on 401
const axiosInstance = axios.create({
  baseURL,
  headers: getHeaders(`${baseURL}${endpointPath}`),
});

/**
 *  Get connected user account information
 */
export const getMe = async (): Promise<User> => {
  const { data } = await axiosInstance.get<User>(endpointPath);
  return data;
};
