import React from 'react';

export const DashboardGridLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <div className="w-full block">
    <div className="grid grid-cols-1 md:items-start md:grid-cols-3 gap-4 md:gap-6">
      {children}
    </div>
  </div>
);
