import { v6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

export interface User {
  ovhSubsidiary: string;
}
export const getUser = async (): Promise<User> => {
  const { data } = await v6.get(`/me`);
  return data as User;
};

export const getUserQuery = () => ({
  queryKey: ['me'],
  queryFn: () => getUser(),
});

export const useUser = () => useQuery(getUserQuery());
