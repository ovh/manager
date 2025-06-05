import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Country, LegalForm, Subsidiary } from '@ovh-ux/manager-config';
import userContext from '@/context/user/user.context';
import { useMe } from '@/data/hooks/useMe';
import { urls } from '@/routes/routes.constant';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const UserProvider = ({ children = [] }: Props): JSX.Element => {
  const navigate = useNavigate();
  const { data: me, isFetched, error } = useMe({ retry: 0 });
  // We will need to add states for country and language to prefill the /info form
  const [legalForm, setLegalForm] = useState<LegalForm | undefined>(undefined);
  const [ovhSubsidiary, setOvhSubsidiary] = useState<Subsidiary | undefined>(
    undefined,
  );
  const [country, setCountry] = useState<Country | undefined>(undefined);

  useEffect(() => {
    if (isFetched) {
      if (error?.status === 401) {
        navigate(urls.preferences);
      } else {
        setLegalForm(me?.legalform);
        setOvhSubsidiary(me?.ovhSubsidiary);
        setCountry(me?.country as Country);
        navigate(urls.accountType);
      }
    }
  }, [isFetched]);

  const context = {
    legalForm,
    setLegalForm,
    ovhSubsidiary,
    country,
  };

  return (
    <userContext.Provider value={context}>{children}</userContext.Provider>
  );
};

export default UserProvider;
