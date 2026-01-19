import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { toUnicode } from 'punycode';
import config from '@/web-domains.config';
import { Link as OdsLink } from '@ovhcloud/ods-react';
import { Link as RouterLink } from 'react-router-dom';

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
      <OdsLink
        data-testid={allDomName}
        href={url as string}
        as={RouterLink}
        to={path}
      >
        {toUnicode(allDomName)}
      </OdsLink>
    </DataGridTextCell>
  );
}
