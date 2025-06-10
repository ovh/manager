import { createContext } from 'react';
import { Subsidiary } from '@/types/subsidary';

export type UserContext = {
  legalForm?: string;
  ovhSubsidiary?: Subsidiary;
  setLegalForm: (legalForm: string) => void;
};

const userContext = createContext<UserContext | undefined>(undefined);

export default userContext;
