import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { Link } from '@ovhcloud/ods-react';
import { useTrackNavigation } from '@/hooks/tracking/useTrackDatagridNavivationLink';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

interface ActionMeDnsComponentProps {
  readonly domainName: string;
}

export default function ActionMeDnsComponent({
  domainName,
}: ActionMeDnsComponentProps) {
  const { trackPageNavivationLink } = useTrackNavigation();
  const { t } = useTranslation('dashboard');
  const { data: availability } = useFeatureAvailability(['web-domains:domains']);
  const { data: webUrl } = useNavigationGetUrl(['web', '', {}]);
  const { data: webDomainsUrl } = useNavigationGetUrl(['web-domains', '', {}]);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if(webUrl){
      setUrl(`${webUrl as string}/domain/${domainName}/dns-modify`)
    }
    if (webDomainsUrl && availability?.['web-domains:domains']){
        setUrl(`${webDomainsUrl as string}/domain/${domainName}/dns-modify`);
      }
  }, [availability,webUrl, webDomainsUrl]);

  return (
    <Link
      href={url}
      color="primary"
      className="block"
      icon="external-link"
      disabled={!url}
      onClick={() => {
        trackPageNavivationLink(url);
      }}
    >
      {t('domain_operations_update_dns_click')}
    </Link>
  );
}
