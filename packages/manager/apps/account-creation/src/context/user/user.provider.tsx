import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Country, LegalForm, Subsidiary, User } from '@ovh-ux/manager-config';
import userContext from '@/context/user/user.context';
import { useTrackingContext } from '@/context/tracking/useTracking';
import { useMe } from '@/data/hooks/useMe';
import { urls } from '@/routes/routes.constant';
import { Company } from '@/types/company';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const UserProvider = ({ children = [] }: Props): JSX.Element => {
  const navigate = useNavigate();
  const { setUser } = useTrackingContext();
  const { data: me, isFetched, error } = useMe({ retry: 0 });
  // We will need to add states for language to prefill the /details form
  const [legalForm, setLegalForm] = useState<LegalForm | undefined>(undefined);
  const [ovhSubsidiary, setOvhSubsidiary] = useState<Subsidiary | undefined>(
    undefined,
  );
  const [country, setCountry] = useState<Country | undefined>(undefined);
  const [organisation, setOrganisation] = useState<string | undefined>(
    undefined,
  );
  const [
    companyNationalIdentificationNumber,
    setCompanyNationalIdentificationNumber,
  ] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);

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

  useEffect(() => {
    // TODO: add currency to dependencies (MANAGER-17334)
    setUser({
      ...(me || {}),
      legalform: legalForm,
      country,
    } as User);
  }, [legalForm, country]);

  const setCompany = (company: Company) => {
    setOrganisation(company.name);
    setCompanyNationalIdentificationNumber(
      company.secondaryCNIN || company.primaryCNIN,
    );
    if (company.address) {
      setAddress(company.address);
    }
    if (company.city) {
      setCity(company.city);
    }
  };

  const context = {
    legalForm,
    setLegalForm,
    ovhSubsidiary,
    country,
    organisation,
    companyNationalIdentificationNumber,
    address,
    city,
    setCompany,
  };

  return (
    <userContext.Provider value={context}>{children}</userContext.Provider>
  );
};

export default UserProvider;
