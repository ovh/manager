import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { FC, PropsWithChildren } from 'react';

export const ExternalLink: FC<PropsWithChildren<{
  href: string;
  isExternal?: boolean;
}>> = ({ children, href, isExternal }) => (
  <Links
    label={children}
    href={href}
    target={
      isExternal
        ? OdsHTMLAnchorElementTarget._blank
        : OdsHTMLAnchorElementTarget._self
    }
    type={LinkType.external}
  />
);

export default ExternalLink;
