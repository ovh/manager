import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { LinkType, Links, OvhSubsidiary } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';

const urls: Partial<{ [key in OvhSubsidiary]: string }> = {
  FR: '/#',
  GB: '/#',
  DEFAULT: '/#',
};

export const BillingLink: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { t } = useTranslation('veeam-backup');
  const { environment } = React.useContext(ShellContext);

  const href =
    urls[environment.user.ovhSubsidiary as OvhSubsidiary] || urls.DEFAULT;

  return (
    <Links
      className={className}
      type={LinkType.external}
      label={t('more_info_billing_modalities')}
      href={href}
    />
  );
};
