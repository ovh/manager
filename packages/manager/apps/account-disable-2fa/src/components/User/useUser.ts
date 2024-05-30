import { useContext } from 'react';
import userContext, { UserContext } from '@/components/User/context';

const useUser = (): UserContext => {
  return useContext(userContext);
};

export default useUser;
