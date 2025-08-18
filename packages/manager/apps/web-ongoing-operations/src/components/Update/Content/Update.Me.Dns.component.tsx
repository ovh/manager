import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { Link } from '@ovhcloud/ods-react';

interface ActionMeDnsComponentProps {
  readonly domainName: string;
}

export default function ActionMeDnsComponent({
  domainName,
}: ActionMeDnsComponentProps) {
  const { t } = useTranslation('dashboard');
  const { data: webUrl } = useNavigationGetUrl(['web', '', {}]);

  const url = `${webUrl as string}/domain/${domainName}/dns-modify`;
  return (
    <Link
      href={url}
      color="primary"
      className="block"
      icon="external-link"
      isDisabled={!url}
    >
      {t('domain_operations_update_dns_click')}
    </Link>
  );
}
