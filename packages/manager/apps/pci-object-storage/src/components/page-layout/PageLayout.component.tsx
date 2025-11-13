import React from 'react';

const PageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="mx-auto my-4 max-w-[1600px] px-6 space-y-2"
      data-testid="pageLayout"
    >
      {children}
    </div>
  );
};

export default PageLayout;
