import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userContext from '@/context/user/user.context';
import { useMe } from '@/data/hooks/useMe';
import { urls } from '@/routes/routes.constant';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const UserProvider = ({ children = [] }: Props): JSX.Element => {
  const navigate = useNavigate();
  const { data: user, isFetched, error } = useMe();

  useEffect(() => {
    if (isFetched) {
      if (error?.status === 401) {
        navigate(urls.preferences);
      } else {
        navigate(urls.accountType);
      }
    }
  }, [isFetched]);

  return <userContext.Provider value={user}>{children}</userContext.Provider>;
};

export default UserProvider;
