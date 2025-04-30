import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userContext from '@/context/user/user.context';
import { useMe } from '@/data/hooks/useMe';
import { urls } from '@/routes/routes.constant';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const UserProvider = ({ children = [] }: Props): JSX.Element => {
  const navigate = useNavigate();
  const { data: me, isFetched, error, refetch } = useMe({ retry: 0 });
  // We will need to add states for country and language to prefill the /info form
  const [legalForm, setLegalForm] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isFetched) {
      if (error?.status === 401) {
        navigate(urls.preferences);
      } else {
        setLegalForm('association');
        navigate(urls.accountType);
      }
    }
  }, [isFetched]);

  return (
    <userContext.Provider value={{ legalForm, setLegalForm }}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
