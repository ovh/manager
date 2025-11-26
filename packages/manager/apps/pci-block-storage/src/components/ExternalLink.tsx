import { FC, PropsWithChildren } from 'react';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import { LinkType, Links } from '@ovh-ux/manager-react-components';

const ExternalLink: FC<
  PropsWithChildren<{
    href: string;
    isTargetBlank?: boolean;
  }>
> = ({ children, href, isTargetBlank = true }) => (
  <Links
    label={children}
    href={href}
    target={isTargetBlank ? OdsHTMLAnchorElementTarget._blank : OdsHTMLAnchorElementTarget._self}
    type={LinkType.external}
  />
);

export default ExternalLink;
