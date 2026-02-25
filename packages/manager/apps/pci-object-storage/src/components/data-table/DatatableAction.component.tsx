import { ReactNode } from 'react';

const DatatableAction = ({ children }: { children: ReactNode }) => (
  <>{children || <></>}</>
);

export { DatatableAction };
