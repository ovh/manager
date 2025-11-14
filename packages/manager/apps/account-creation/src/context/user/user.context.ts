import { createContext } from 'react';
import {
  Country,
  LegalForm,
  Subsidiary,
  UserLocales,
} from '@ovh-ux/manager-config';
import { Company } from '@/types/company';

export type UserContext = {
  legalForm?: LegalForm;
  country?: Country;
  ovhSubsidiary?: Subsidiary;
  setLegalForm: (legalForm: LegalForm) => void;
  organisation?: string;
  companyNationalIdentificationNumber?: string;
  address?: string;
  city?: string;
  setCompany: (company: Company | null) => void;
  language?: UserLocales | undefined;
  isSMSConsentAvailable: boolean;
};

const userContext = createContext<UserContext | undefined>(undefined);

export default userContext;
