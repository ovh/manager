import React from 'react';

export const PageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="m-10">{children}</div>;
};
