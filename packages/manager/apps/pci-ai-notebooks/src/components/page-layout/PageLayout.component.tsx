import React from 'react';

const PageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="m-10 space-y-2" data-testid="pageLayout">
      {children}
    </div>
  );
};

export default PageLayout;
