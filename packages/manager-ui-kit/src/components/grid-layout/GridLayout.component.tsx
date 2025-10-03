import { PropsWithChildren, FC } from 'react';

export const GridLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="w-full block">
    <div className="grid grid-cols-1 md:items-start md:grid-cols-3 gap-4 md:gap-6">
      {children}
    </div>
  </div>
);
