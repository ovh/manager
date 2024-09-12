import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

export const Title: React.FC<
  React.PropsWithChildren<{
    className?: string;
  }>
> = ({ children, className }) => {
  return (
    <h1
      className={`${className} m-0 p-0 text-[--ods-color-heading] text-[36px] leading-[45px] font-bold mb-[24px]`}
    >
      {children}
    </h1>
  );
};

export const Subtitle: React.FC<
  React.PropsWithChildren<{
    className?: string;
  }>
> = ({ children, className }) => {
  return (
    <span
      className={`${className} m-0 p-0 text-[--ods-color-heading] text-[24px] leading-[32px] font-bold`}
    >
      {children}
    </span>
  );
};

export default Title;
