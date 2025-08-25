import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import React from 'react';
import { toUnicode } from 'punycode';
import { Link } from '@ovhcloud/ods-react';

interface DomainDatagridColumnDomainProps {
  readonly domain: string;
}

export default function DomainDatagridColumnDomain({
  domain,
}: DomainDatagridColumnDomainProps) {
  const { data: webUrl } = useNavigationGetUrl(['web', '/domain', {}]);
  return (
    <Link href={`${webUrl}/${domain}/information`}>{toUnicode(domain)}</Link>
  );
}
