import React from 'react';

const PageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="m-10">{children}</div>;
};

export default PageLayout;
