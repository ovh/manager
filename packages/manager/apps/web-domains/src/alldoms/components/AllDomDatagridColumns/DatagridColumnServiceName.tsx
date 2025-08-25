import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { toUnicode } from 'punycode';
import { Link } from '@ovhcloud/ods-react';
import config from '@/web-domains.config';

interface DatagridColumnServiceNameProps {
  readonly allDomName: string;
}

export default function DatagridColumnServiceName({
  allDomName,
}: DatagridColumnServiceNameProps) {
  const { data: url } = useNavigationGetUrl([
    config.rootLabel,
    `/alldoms/${allDomName}`,
    {},
  ]);

  return (
    <DataGridTextCell>
      <Link href={url as string} data-testid={allDomName}>
        {toUnicode(allDomName)}
      </Link>
    </DataGridTextCell>
  );
}
