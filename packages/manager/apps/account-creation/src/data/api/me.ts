import axios from 'axios';
import { User } from '@ovh-ux/manager-config';

// We use a dedicated axios instance in order to bypass the redirection to login page on 401
const axiosInstance = axios.create({
  baseURL: '/engine/apiv6',
});

/**
 *  Get connected user account information
 */
export const getMe = async (): Promise<User> => {
  const { data } = await axiosInstance.get<User>(`/me`);
  return data;
};
