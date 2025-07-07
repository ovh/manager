import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { Link } from '@ovhcloud/ods-react';
import config from '@/web-domains.config';

interface DatagridColumnServiceNameProps {
  readonly domainName: string;
}

export default function DatagridColumnServiceName({
  domainName,
}: DatagridColumnServiceNameProps) {
  const { data: url } = useNavigationGetUrl([
    config.rootLabel,
    `/domain/${domainName}/information`,
    {},
  ]);

  return (
    <DataGridTextCell>
      <Link href={url as string} data-testid={domainName}>
        {domainName}
      </Link>
    </DataGridTextCell>
  );
}
