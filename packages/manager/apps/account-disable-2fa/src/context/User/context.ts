import { createContext } from 'react';

export type User = {
  legalForm: string;
  email: string;
  language: string;
  subsidiary: string;
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
