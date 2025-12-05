import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { toUnicode } from 'punycode';
import { Link as OdsLink } from '@ovhcloud/ods-react';
import { Link as RouterLink } from 'react-router-dom';
import config from '@/web-domains.config';
interface DomainDatagridColumnDomainProps {
  readonly domain: string;
}

export default function DomainDatagridColumnDomain({
  domain,
}: DomainDatagridColumnDomainProps) {
  const path = `/domain/${domain}/information`;
  const { data: url } = useNavigationGetUrl([config.rootLabel, path, {}]);
  return (
    <OdsLink href={url as string} as={RouterLink} to={path}>
      {toUnicode(domain)}
    </OdsLink>
  );
}
