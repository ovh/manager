import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { FC, PropsWithChildren } from 'react';

const ExternalLink: FC<PropsWithChildren<{
  href: string;
  isTargetBlank?: boolean;
}>> = ({ children, href, isTargetBlank = true }) => (
  <Links
    label={children}
    href={href}
    target={
      isTargetBlank
        ? OdsHTMLAnchorElementTarget._blank
        : OdsHTMLAnchorElementTarget._self
    }
    type={LinkType.external}
  />
);

export default ExternalLink;
