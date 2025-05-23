import { createContext } from 'react';

export type UserContext = {
  legalForm?: string;
  setLegalForm: (legalForm: string) => void;
};

const userContext = createContext<UserContext | undefined>(undefined);

export default userContext;
