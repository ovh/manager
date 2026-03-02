import { createContext, PropsWithChildren, useState } from 'react';

import { IamServiceAccountSecret } from '@/data/api/iam-service-accounts';

export type ServiceAccountSecretContextType = {
  secret: IamServiceAccountSecret | null;
  setSecret: (tokenSecret: IamServiceAccountSecret | null) => void;
};

const ServiceAccountSecretContext = createContext<
  ServiceAccountSecretContextType
>({
  secret: null,
  setSecret: () => {},
});

export const ServiceAccountSecretProvider = ({
  children,
}: PropsWithChildren) => {
  const [secret, setSecret] = useState<IamServiceAccountSecret | null>(null);
  return (
    <ServiceAccountSecretContext.Provider value={{ secret, setSecret }}>
      {children}
    </ServiceAccountSecretContext.Provider>
  );
};

export default ServiceAccountSecretContext;
