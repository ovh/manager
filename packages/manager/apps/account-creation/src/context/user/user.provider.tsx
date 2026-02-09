import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Country,
  LegalForm,
  Subsidiary,
  User,
  UserLocales,
} from '@ovh-ux/manager-config';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import userContext from '@/context/user/user.context';
import { useTrackingContext } from '@/context/tracking/useTracking';
import { useMe } from '@/data/hooks/useMe';
import { urls } from '@/routes/routes.constant';
import { Company } from '@/types/company';
import { useLegacySignupRedirection } from '@/hooks/legacySignupRedirection/useLegacySignupRedirection';
import { isUserLoggedIn } from '@/helpers/flowHelper';
import { useLocalCountry } from '@/hooks/useLocalCountry/useLocalCountry';

const NEW_ACCOUNT_CREATION_ACCESS_FEATURE = 'account-creation';
const SMS_CONSENT_FEATURE = 'account:sms-consent';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const UserProvider = ({ children = [] }: Props): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setUser } = useTrackingContext();
  const { data: me, isFetched, isError } = useMe();
  const { data: availability } = useFeatureAvailability(
    [NEW_ACCOUNT_CREATION_ACCESS_FEATURE, SMS_CONSENT_FEATURE],
    { enabled: Boolean(isFetched && me) },
  );
  const redirectToLegacySignup = useLegacySignupRedirection();
  const [legalForm, setLegalForm] = useState<LegalForm | undefined>(undefined);
  const [ovhSubsidiary, setOvhSubsidiary] = useState<Subsidiary | undefined>(
    undefined,
  );
  const [localCountry] = useLocalCountry();
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
  const [language, setLanguage] = useState<UserLocales | undefined>(undefined);

  useEffect(() => {
    if (!isUserLoggedIn() && location.pathname !== urls.settings) {
      navigate(`${urls.settings}?${searchParams.toString()}`);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isFetched || isError) {
      return;
    }
    setLegalForm(me?.legalform);
    setOvhSubsidiary(me?.ovhSubsidiary);
    /**
     * TODO: Remove this when the API is updated to return the country
     */
    if ((me?.country === 'UNKNOWN' || !me?.country) && localCountry) {
      setCountry(localCountry);
    } else {
      setCountry(me?.country);
    }
    setLanguage(me?.language || undefined);
    // When we receive the user data, we will call setUser to update the tracking configuration
    setUser({
      ...(me || {}),
      language: me?.language || undefined,
    } as User);
  }, [isFetched, isError]);

  useEffect(() => {
    if (!availability || location.pathname === urls.settings) {
      return;
    }
    if (!availability[NEW_ACCOUNT_CREATION_ACCESS_FEATURE]) {
      redirectToLegacySignup();
    } else if (location.pathname === urls.root) {
      navigate(`${urls.accountType}?${searchParams.toString()}`);
    }
  }, [availability, location.pathname]);

  // When the legal form is updated, we will call setUser to update the tracking configuration
  useEffect(() => {
    setUser({
      ...(me || {}),
      legalform: legalForm,
    } as User);
  }, [legalForm]);

  const setCompany = (company: Company | null) => {
    if (company !== null) {
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
    } else {
      setOrganisation(undefined);
      setCompanyNationalIdentificationNumber(undefined);
      setAddress(undefined);
      setCity(undefined);
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
    language,
    isSMSConsentAvailable: availability?.[SMS_CONSENT_FEATURE] ?? false,
  };

  return (
    <userContext.Provider value={context}>{children}</userContext.Provider>
  );
};

export default UserProvider;
