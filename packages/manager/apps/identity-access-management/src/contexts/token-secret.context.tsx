import { createContext, PropsWithChildren, useState } from 'react';

export type TokenSecretContextType = {
  tokenSecret: null | string;
  setTokenSecret: (tokenSecret: string | null) => void;
};

const TokenSecretContext = createContext<TokenSecretContextType>({
  tokenSecret: null,
  setTokenSecret: () => {},
});

export const TokenSecretProvider = ({ children }: PropsWithChildren) => {
  const [tokenSecret, setTokenSecret] = useState<string | null>(null);
  return (
    <TokenSecretContext.Provider value={{ tokenSecret, setTokenSecret }}>
      {children}
    </TokenSecretContext.Provider>
  );
};

export default TokenSecretContext;
