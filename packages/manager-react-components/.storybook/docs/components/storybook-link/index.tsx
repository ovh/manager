import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { navigate } from '@storybook/addon-links';
import React from 'react';

type Props = {
  className?: string;
  icon?: ODS_ICON_NAME;
  kind?: string;
  label: string;
  story?: string;
  title?: string;
};

const StorybookLink = ({
  className,
  icon,
  kind,
  label,
  story,
  title,
}: Props) => {
  return (
    <OdsLink
      className={className || ''}
      href="#"
      icon={icon}
      label={label}
      onClick={(e) => {
        e.preventDefault();
        navigate(title ? { title } : { kind, story });
      }}
    />
  );
};

export { StorybookLink };
