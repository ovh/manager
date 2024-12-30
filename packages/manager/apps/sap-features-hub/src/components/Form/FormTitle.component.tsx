import { OdsText } from '@ovhcloud/ods-components/react';
import React, { HTMLAttributes } from 'react';

type FormTitleProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  subtitle?: string;
};

export const FormTitle: React.FC<FormTitleProps> = ({
  title,
  subtitle,
  className,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-y-8 mb-8 ${className || ''}`} {...props}>
      <OdsText preset="heading-2">{title}</OdsText>
      {subtitle && <OdsText>{subtitle}</OdsText>}
    </div>
  );
};
