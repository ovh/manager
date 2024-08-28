import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import './title.scss';

export const Title: React.FC<
  React.PropsWithChildren<{
    className?: string;
  }>
> = ({ children, className }) => {
  return (
    <OdsText className={className} preset={ODS_TEXT_PRESET.heading1}>
      {children}
    </OdsText>
  );
};

export const Subtitle: React.FC<
  React.PropsWithChildren<{
    className?: string;
  }>
> = ({ children, className }) => {
  return (
    <OdsText
      className={`${className} subtitle`}
      preset={ODS_TEXT_PRESET.heading2}
    >
      {children}
    </OdsText>
  );
};

export default Title;
