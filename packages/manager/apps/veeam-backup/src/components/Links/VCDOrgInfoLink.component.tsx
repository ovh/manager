import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  LinkType,
  Links,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';

const urls: Partial<{ [key in OvhSubsidiary]: string }> = {
  FR: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
  DEFAULT: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
};

export const VCDOrgInfoLink: React.FC<{
  label: string;
  className?: string;
}> = ({ label, className }) => {
  const { environment } = React.useContext(ShellContext);

  const href =
    urls[environment.user.ovhSubsidiary as OvhSubsidiary] || urls.DEFAULT;

  return (
    <Links
      className={className}
      type={LinkType.external}
      label={label}
      href={href}
    />
  );
};
