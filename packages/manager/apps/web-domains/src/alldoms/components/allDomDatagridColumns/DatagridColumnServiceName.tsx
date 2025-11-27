import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { toUnicode } from 'punycode';
import { Link as ODSLink } from '@ovhcloud/ods-react';
import { Link } from 'react-router-dom';
import config from '@/web-domains.config';

interface DatagridColumnServiceNameProps {
  readonly allDomName: string;
}

export default function DatagridColumnServiceName({
  allDomName,
}: DatagridColumnServiceNameProps) {
  const path = `/alldoms/${allDomName}`;
  const { data: url } = useNavigationGetUrl([config.rootLabel, path, {}]);

  return (
    <DataGridTextCell>
      <Link to={path} data-testid={allDomName}>
        <ODSLink href={url}>{toUnicode(allDomName)}</ODSLink>
      </Link>
    </DataGridTextCell>
  );
}
