import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  LinkType,
  Links,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

const urls: Partial<{ [key in OvhSubsidiary]: string }> = {
  ES: 'https://www.ovhcloud.com/es-es/lp/vmware-vcd-evolution/',
  IE: 'https://www.ovhcloud.com/en-ie/lp/vmware-vcd-evolution/',
  IT: 'https://www.ovhcloud.com/it/lp/vmware-vcd-evolution/',
  NL: 'https://www.ovhcloud.com/nl/lp/vmware-vcd-evolution/',
  PL: 'https://www.ovhcloud.com/pl/lp/vmware-vcd-evolution/',
  PT: 'https://www.ovhcloud.com/pt/lp/vmware-vcd-evolution/',
  GB: 'https://www.ovhcloud.com/en-gb/lp/vmware-vcd-evolution/',
  FR: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
  QC: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
  CA: 'https://www.ovhcloud.com/en-ca/lp/vmware-vcd-evolution/',
  DE: 'https://www.ovhcloud.com/de/lp/vmware-vcd-evolution/',
  US: 'https://us.ovhcloud.com/lp/vmware-vcd-evolution/',
  WS: 'https://www.ovhcloud.com/es/lp/vmware-vcd-evolution/',
  MA: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
  TN: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
  SN: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
  AU: 'https://www.ovhcloud.com/en-au/lp/vmware-vcd-evolution/',
  SG: 'https://www.ovhcloud.com/en-sg/lp/vmware-vcd-evolution/',
  ASIA: 'https://www.ovhcloud.com/asia/lp/vmware-vcd-evolution/',
  WE: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
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
      target={OdsHTMLAnchorElementTarget._blank}
      label={label}
      href={href}
    />
  );
};
