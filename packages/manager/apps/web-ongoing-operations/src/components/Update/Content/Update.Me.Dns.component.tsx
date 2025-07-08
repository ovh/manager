import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

interface ActionMeDnsComponentProps {
  readonly domainName: string;
}

export default function ActionMeDnsComponent({
  domainName,
}: ActionMeDnsComponentProps) {
  const { t } = useTranslation('dashboard');
  const { data: webUrl } = useNavigationGetUrl(['web', '', {}]);

  const url = `${webUrl}/domain/${domainName}/dns-modify`;
  return (
    <OdsLink
      href={url}
      color="primary"
      label={t('domain_operations_update_dns_click')}
      className="block"
      icon="external-link"
      isDisabled={!url}
    />
  );
}
