import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  LinkType,
  Links,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

const urls: Partial<{ [key in OvhSubsidiary]: string }> = {
  DE: 'https://www.ovhcloud.com/de/lp/vmware-vcd-evolution/veeam/',
  PT: 'https://www.ovhcloud.com/pt/lp/vmware-vcd-evolution/veeam/',
  PL: 'https://www.ovhcloud.com/pl/lp/vmware-vcd-evolution/veeam/',
  IT: 'https://www.ovhcloud.com/it/lp/vmware-vcd-evolution/veeam/',
  NL: 'https://www.ovhcloud.com/nl/lp/vmware-vcd-evolution/veeam/',
  ES: 'https://www.ovhcloud.com/es-es/lp/vmware-vcd-evolution/veeam/',
  FR: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/veeam/',
  GB: 'https://www.ovhcloud.com/en-gb/lp/vmware-vcd-evolution/veeam/',
  IE: 'https://www.ovhcloud.com/en-ie/lp/vmware-vcd-evolution/veeam/',
  AU: 'https://www.ovhcloud.com/en-au/lp/vmware-vcd-evolution/veeam/',
  MA: 'https://www.ovhcloud.com/fr-ma/lp/vmware-vcd-evolution/veeam/',
  SN: 'https://www.ovhcloud.com/fr-sn/lp/vmware-vcd-evolution/veeam/',
  TN: 'https://www.ovhcloud.com/fr-tn/lp/vmware-vcd-evolution/veeam/',
  US: 'https://us.ovhcloud.com/lp/vmware-vcd-evolution/veeam/',
  CA: 'https://www.ovhcloud.com/en-ca/lp/vmware-vcd-evolution/veeam/',
  QC: 'https://www.ovhcloud.com/fr-ca/lp/vmware-vcd-evolution/veeam/',
  SG: 'https://www.ovhcloud.com/en-sg/lp/vmware-vcd-evolution/veeam/',
  ASIA: 'https://www.ovhcloud.com/asia/lp/vmware-vcd-evolution/veeam/',
  IN: 'https://www.ovhcloud.com/en-in/lp/vmware-vcd-evolution/veeam/',
  WE: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/veeam/',
  WS: 'https://www.ovhcloud.com/es/lp/vmware-vcd-evolution/veeam/',
  DEFAULT: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/veeam/',
};

export const useBillingUrl = () => {
  const { environment } = React.useContext(ShellContext);
  return urls[environment.user.ovhSubsidiary as OvhSubsidiary] || urls.DEFAULT;
};

export const BillingLink: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { t } = useTranslation('veeam-backup');
  const href = useBillingUrl();

  return (
    <Links
      className={className}
      type={LinkType.external}
      label={t('more_info_billing_modalities')}
      href={href}
      target="_blank"
      rel="noopener"
    />
  );
};
