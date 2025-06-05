import { createContext } from 'react';
import { Country, LegalForm, Subsidiary } from '@ovh-ux/manager-config';

export type UserContext = {
  legalForm?: LegalForm;
  country?: Country;
  ovhSubsidiary?: Subsidiary;
  setLegalForm: (legalForm: LegalForm) => void;
};

const userContext = createContext<UserContext | undefined>(undefined);

export default userContext;
