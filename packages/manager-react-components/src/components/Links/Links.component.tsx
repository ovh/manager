import React from 'react';
import { Link, Icon, LINK_COLOR } from '@ovhcloud/ods-react';
import { LinkType, LinksProps } from './Links.props';

export const Links: React.FC<LinksProps> = ({
  children,
  onClickReturn,
  type,
  href,
  className = '',
  'data-testid': dataTestId,
  ...props
}) => (
  <Link
    className={className}
    href={href}
    onClick={onClickReturn}
    data-testid={dataTestId}
    {...props}
  >
    {type === LinkType.back && <Icon name="arrow-left" />}
    {children}
    {type === LinkType.external && <Icon name="external-link" />}
    {type === LinkType.next && <Icon name="arrow-right" />}
  </Link>
);

export default Links;
