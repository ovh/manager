import { createContext } from 'react';

import { LegalFrom, Subsidiary } from '@/types/user.type';

export type User = {
  legalForm: LegalFrom;
  email: string;
  language: string;
  subsidiary: Subsidiary;
  iss: string;
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
};

export type UserContext = {
  user: User | null;
};

const userContext = createContext<UserContext>({ user: null });

export default userContext;
