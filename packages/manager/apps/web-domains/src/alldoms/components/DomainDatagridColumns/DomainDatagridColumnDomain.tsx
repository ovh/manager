import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { OdsLink } from '@ovhcloud/ods-components/react';
import React from 'react';
import { toUnicode } from 'punycode';

interface DomainDatagridColumnDomainProps {
  readonly domain: string;
}

export default function DomainDatagridColumnDomain({
  domain,
}: DomainDatagridColumnDomainProps) {
  const { data: webUrl } = useNavigationGetUrl(['web', '/domain', {}]);
  return (
    <DataGridTextCell>
      <OdsLink
        label={toUnicode(domain)}
        href={`${webUrl}/${domain}/information`}
      />
    </DataGridTextCell>
  );
}
