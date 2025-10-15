import { useContext } from 'react';

import userContext, { UserContext } from '@/context/User/context';

export default (): UserContext => {
  return useContext(userContext);
};
