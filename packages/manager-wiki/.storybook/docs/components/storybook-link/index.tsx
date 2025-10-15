import React from 'react';
import { Link, ICON_NAME } from '@ovhcloud/ods-react';

type Props = {
  className?: string;
  icon?: ICON_NAME;
  label: string;
  href?: string;
};

const StorybookLink = ({ className, icon, label, href = '' }: Props) => {
  return (
    <Link
      className={className || ''}
      href={href}
      icon={icon}
      target="_blank"
      label={label}
    />
  );
};

export { StorybookLink };
