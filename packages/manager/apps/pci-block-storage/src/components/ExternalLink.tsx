import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { FC, PropsWithChildren } from 'react';

export const ExternalLink: FC<PropsWithChildren<{
  href: string;
}>> = ({ children, href }) => (
  <Links
    label={children}
    href={href}
    target={OdsHTMLAnchorElementTarget._blank}
    type={LinkType.external}
  />
);

export default ExternalLink;
