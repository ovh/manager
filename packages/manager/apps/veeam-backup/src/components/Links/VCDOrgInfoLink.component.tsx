import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  LinkType,
  Links,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';

const urls: Partial<{ [key in OvhSubsidiary]: string }> = {
  ES: 'https://www.ovhcloud.com/es-es/public-vcf-aas/ ',
  IE: 'https://www.ovhcloud.com/en-ie/public-vcf-aas/ ',
  IT: 'https://www.ovhcloud.com/it/public-vcf-aas/ ',
  NL: 'https://www.ovhcloud.com/nl/public-vcf-aas/ ',
  PL: 'https://www.ovhcloud.com/pl/public-vcf-aas/ ',
  PT: 'https://www.ovhcloud.com/pt/public-vcf-aas/ ',
  GB: 'https://www.ovhcloud.com/en-gb/public-vcf-aas/ ',
  FR: 'https://www.ovhcloud.com/fr/public-vcf-aas/ ',
  QC: 'https://www.ovhcloud.com/fr/public-vcf-aas/ ',
  CA: 'https://www.ovhcloud.com/en-ca/public-vcf-aas/ ',
  DE: 'https://www.ovhcloud.com/de/public-vcf-aas/ ',
  US: 'https://us.ovhcloud.com/public-vcf-aas/ ',
  WS: 'https://www.ovhcloud.com/es/public-vcf-aas/ ',
  MA: 'https://www.ovhcloud.com/fr/public-vcf-aas/ ',
  TN: 'https://www.ovhcloud.com/fr/public-vcf-aas/ ',
  SN: 'https://www.ovhcloud.com/fr/public-vcf-aas/ ',
  AU: 'https://www.ovhcloud.com/en-au/public-vcf-aas/ ',
  SG: 'https://www.ovhcloud.com/en-sg/public-vcf-aas/ ',
  ASIA: 'https://www.ovhcloud.com/asia/public-vcf-aas/ ',
  WE: 'https://www.ovhcloud.com/en/public-vcf-aas/ ',
  DEFAULT: 'https://www.ovhcloud.com/en/public-vcf-aas/ ',
};

export const VCDOrgInfoLink: React.FC<{
  label?: string;
  className?: string;
  children?: string;
}> = ({ label, className, children }) => {
  const { environment } = React.useContext(ShellContext);
  const href =
    urls[environment.user.ovhSubsidiary as OvhSubsidiary] || urls.DEFAULT;

  return (
    <Links
      className={className}
      label={label || undefined}
      type={LinkType.external}
      target="_blank"
      href={href}
    >
      {children}
    </Links>
  );
};
