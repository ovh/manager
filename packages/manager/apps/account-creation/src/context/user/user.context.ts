import { createContext } from 'react';

export type UserContext =
  | undefined
  | {
      legalForm?: string;
      setLegalForm: (legalForm: string) => void;
    };

const userContext = createContext<UserContext>(undefined);

export default userContext;
