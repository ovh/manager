import { createContext } from 'react';
import { LegalFrom } from '@/types/legalForm';

export type UserContext = {
  legalForm?: LegalFrom;
  setLegalForm: (legalForm: LegalFrom) => void;
};

const userContext = createContext<UserContext | undefined>(undefined);

export default userContext;
