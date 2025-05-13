import { ReactNode } from 'react';

export function DatatableAction({ children }: { children: ReactNode }) {
  return <>{children || <></>}</>;
}
