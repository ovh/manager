import { createContext, useContext, ReactNode } from 'react';
import useUserActivity from '@/hooks/useUserActivity.hook';

interface UserActivityContextProps {
  isUserActive: boolean;
}

const UserActivityContext = createContext<UserActivityContextProps | undefined>(
  undefined,
);

interface UserActivityProviderProps {
  timeout: number;
  onInactive?: () => void;
  onActive?: () => void;
  children: ReactNode;
}
export const UserActivityProvider = ({
  timeout,
  children,
  onActive = () => {},
  onInactive = () => {},
}: UserActivityProviderProps) => {
  const isUserActive = useUserActivity({
    timeout,
    onInactive,
    onActive,
  });

  return (
    <UserActivityContext.Provider value={{ isUserActive }}>
      {children}
    </UserActivityContext.Provider>
  );
};

export const useUserActivityContext = () => {
  const context = useContext(UserActivityContext);
  if (context === undefined) {
    throw new Error(
      'useUserActivityContext must be used within a UserActivityProvider',
    );
  }
  return context;
};
