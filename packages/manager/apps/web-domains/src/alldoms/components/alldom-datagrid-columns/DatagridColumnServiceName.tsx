import React from 'react';

import { toUnicode } from 'punycode/punycode';

import { OdsLink } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

import config from '@/web-domains.config';

interface DatagridColumnServiceNameProps {
  readonly allDomName: string;
}

export default function DatagridColumnServiceName({ allDomName }: DatagridColumnServiceNameProps) {
  const { data: url } = useNavigationGetUrl([config.rootLabel, `/alldoms/${allDomName}`, {}]);

  return (
    <DataGridTextCell>
      <OdsLink
        href={url as string}
        label={toUnicode(allDomName)}
        data-testid={allDomName}
        class="link-banner"
      />
    </DataGridTextCell>
  );
}
