import React from 'react';

export const Title: React.FC<
  React.PropsWithChildren<{
    className?: string;
  }>
> = ({ children, className = '' }) => {
  return (
    <div
      className={`${className} m-0 p-0 text-[--ods-color-heading] text-[36px] leading-[45px] font-bold mb-[24px]`}
    >
      {children}
    </div>
  );
};

export const Subtitle: React.FC<
  React.PropsWithChildren<{
    className?: string;
  }>
> = ({ children, className = '' }) => {
  return (
    <div
      className={`${className} m-0 p-0 text-[--ods-color-heading] text-[24px] leading-[32px] font-bold`}
    >
      {children}
    </div>
  );
};

export default Title;
