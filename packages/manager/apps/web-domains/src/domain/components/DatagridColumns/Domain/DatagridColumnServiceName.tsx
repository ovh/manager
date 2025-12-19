import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { CellRow, ColumnMetaType } from '@ovh-ux/muk';
import { Link as OdsLink } from '@ovhcloud/ods-react';
import { Link } from 'react-router-dom';
import config from '@/web-domains.config';

interface DatagridColumnServiceNameProps {
  readonly domainName: string;
}

export default function DatagridColumnServiceName({
  domainName,
}: DatagridColumnServiceNameProps) {
  const path = `/domain/${domainName}/information`;
  const { data: url } = useNavigationGetUrl([config.rootLabel, path, {}]);

  return (
    <CellRow type={'text' as ColumnMetaType}>
      <OdsLink
        href={url as string}
        data-testid={domainName}
        as={Link}
        to={path}
      >
        {domainName}
      </OdsLink>
    </CellRow>
  );
}
