import { createContext } from 'react';
import { LegalForm } from '@ovh-ux/manager-config';

export type UserContext = {
  legalForm?: LegalForm;
  setLegalForm: (legalForm: LegalForm) => void;
};

const userContext = createContext<UserContext | undefined>(undefined);

export default userContext;
