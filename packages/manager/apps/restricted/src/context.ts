import React, { createContext } from 'react';

export type Auth = {
  account?: string;
  method?: string;
  roles?: string[];
  user?: string;
};

export type Context = {
  auth?: Auth;
  isSidebarVisible?: boolean;
  locale?: string;
  ovhSubsidiary?: string;
  region?: string;
  setLocale?: React.Dispatch<React.SetStateAction<string>>;
  setIsSidebarVisible?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Context = createContext<Context>({});

export default Context;
