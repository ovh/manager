import { ReactNode } from 'react';

export type RedirectionGuardProps = {
  children: ReactNode;
  condition: boolean;
  isLoading: boolean;
  route: string;
  isError?: boolean;
  errorComponent?: ReactNode;
};
