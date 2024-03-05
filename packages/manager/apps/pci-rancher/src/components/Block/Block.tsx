import React from 'react';

const Block: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="my-3">{children}</div>;
};

export default Block;
