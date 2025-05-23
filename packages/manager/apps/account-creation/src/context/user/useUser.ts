import { useContext } from 'react';
import userContext, { UserContext } from './user.context';

export const useUserContext = (): UserContext => {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
