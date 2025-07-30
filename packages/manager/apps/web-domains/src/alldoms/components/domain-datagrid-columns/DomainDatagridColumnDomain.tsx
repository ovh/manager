import React from 'react';

import { toUnicode } from 'punycode/punycode';

import { OdsLink } from '@ovhcloud/ods-components/react';

import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

interface DomainDatagridColumnDomainProps {
  readonly domain: string;
}

export default function DomainDatagridColumnDomain({ domain }: DomainDatagridColumnDomainProps) {
  const { data: webUrl } = useNavigationGetUrl(['web', '/domain', {}]);
  return (
    <OdsLink
      label={toUnicode(domain)}
      href={`${webUrl as string}/${domain}/information`}
      class="link-banner"
    />
  );
}
