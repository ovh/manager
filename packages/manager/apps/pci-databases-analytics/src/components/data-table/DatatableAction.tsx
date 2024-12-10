import { ReactNode } from 'react';

const DatatableAction = ({ children }: { children: ReactNode }) => {
  return <>{children || <></>}</>;
};

export default DatatableAction;
