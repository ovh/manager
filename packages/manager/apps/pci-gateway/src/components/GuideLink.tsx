import { FC, PropsWithChildren } from 'react';
import { Links } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

export const GuideLink: FC<PropsWithChildren<{
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
  />
);
