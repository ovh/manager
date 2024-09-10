import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';
import {
  IdentityUser,
  IdentityGroup,
  IdentityOauthClient,
} from '@/types/identity.type';

interface IdentityDataContextType {
  userList: IdentityUser[];
  setUserList: React.Dispatch<React.SetStateAction<IdentityUser[]>>;
  groupList: IdentityGroup[];
  setGroupList: React.Dispatch<React.SetStateAction<IdentityGroup[]>>;
  serviceAccountList: IdentityOauthClient[];
  setServiceAccountList: React.Dispatch<
    React.SetStateAction<IdentityOauthClient[]>
  >;
}

const IdentityDataContext = createContext<IdentityDataContextType | null>(null);

export const useIdentityData = () => {
  const context = useContext(IdentityDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an IdentityDataProvider');
  }
  return context;
};

export const IdentityDataProvider = ({ children }: { children: ReactNode }) => {
  const [userList, setUserList] = useState<IdentityUser[]>([]);
  const [groupList, setGroupList] = useState<IdentityGroup[]>([]);
  const [serviceAccountList, setServiceAccountList] = useState<
    IdentityOauthClient[]
  >([]);

  return (
    <IdentityDataContext.Provider
      value={useMemo(
        () => ({
          userList,
          setUserList,
          groupList,
          setGroupList,
          serviceAccountList,
          setServiceAccountList,
        }),
        [userList, groupList, serviceAccountList],
      )}
    >
      {children}
    </IdentityDataContext.Provider>
  );
};
