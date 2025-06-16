import { FC, PropsWithChildren } from 'react';
import { Links } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

export const GuideLink: FC<PropsWithChildren<{ href: string }>> = ({
  children,
  href,
}) => (
  <Links
    label={children}
    href={href}
    target={OdsHTMLAnchorElementTarget._blank}
  />
);
