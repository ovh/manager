import React from 'react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';

export enum LinkType {
  back = 'back',
  next = 'next',
  external = 'external',
}

export interface LinksProps {
  className?: string;
  download?: string;
  label?: string;
  href?: string;
  rel?: string;
  target?: string;
  type?: LinkType;
  onClickReturn?: () => void;
}

export const Links: React.FC<LinksProps> = ({
  label,
  onClickReturn,
  type,
  href,
  ...props
}: LinksProps) => (
  <OdsLink
    href={href}
    onClick={onClickReturn}
    {...props}
    {...(type === LinkType.next && { icon: ODS_ICON_NAME.arrowRight })}
    {...(type === LinkType.external && { icon: ODS_ICON_NAME.externalLink })}
    label={label}
  ></OdsLink>
);

export default Links;
