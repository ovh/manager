import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { OdsLink } from '@ovhcloud/ods-components/react';
import React from 'react';

interface DomainDatagridColumnDomainProps {
  domain: string;
}

export default function DomainDatagridColumnDomain({
  domain,
}: DomainDatagridColumnDomainProps) {
  const { data: webUrl } = useNavigationGetUrl(['web', '/domain', {}]);
  return (
    <DataGridTextCell>
      <OdsLink label={domain} href={`${webUrl}/${domain}/information`} />
    </DataGridTextCell>
  );
}
