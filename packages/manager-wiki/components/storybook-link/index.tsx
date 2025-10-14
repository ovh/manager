import { Link, ICON_NAME } from '@ovhcloud/ods-react';
import React from 'react';

type Props = {
  className?: string;
  icon?: ICON_NAME;
  label: string;
  href?: string;
};

const StorybookLink = ({ className, icon, label, href = '' }: Props) => {
  return (
    <Link className={className || ''} href={href} icon={icon} target="_blank">
      {label}
    </Link>
  );
};

export { StorybookLink };
