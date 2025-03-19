import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { navigate } from '@storybook/addon-links';
import React from 'react';

type Props = {
  className?: string;
  icon?: ODS_ICON_NAME;
  label: string;
  href?: string;
};

const StorybookLink = ({ className, icon, label, href = '' }: Props) => {
  return (
    <OdsLink
      className={className || ''}
      href={href}
      icon={icon}
      target="_blank"
      label={label}
    />
  );
};

export { StorybookLink };
