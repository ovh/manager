import { Links } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

const GuideLink = ({
  children,
  href,
}: Readonly<{ href: string; children?: string }>) => (
  <Links
    label={children}
    href={href}
    target={OdsHTMLAnchorElementTarget._blank}
  />
);

export default GuideLink;
