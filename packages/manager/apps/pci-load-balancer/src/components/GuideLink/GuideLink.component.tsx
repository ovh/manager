import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import { Links } from '@ovh-ux/manager-react-components';

const GuideLink = ({
  children,
  href,
  isTargetBlank = true,
}: Readonly<{ href: string; children?: string; isTargetBlank?: boolean }>) => (
  <Links
    label={children}
    href={href}
    target={isTargetBlank ? OdsHTMLAnchorElementTarget._blank : OdsHTMLAnchorElementTarget._self}
  />
);

export default GuideLink;
