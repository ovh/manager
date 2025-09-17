import React from 'react';
import {
  ODS_ICON_NAME,
  ODS_LINK_COLOR,
  ODS_LINK_ICON_ALIGNMENT,
} from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';

export enum LinkType {
  back = 'back',
  next = 'next',
  external = 'external',
}
export enum IconLinkAlignmentType {
  left = 'left',
  right = 'right',
}

export interface LinksProps {
  id?: string;
  className?: string;
  color?: ODS_LINK_COLOR;
  download?: string;
  label?: string;
  children?: string;
  href?: string;
  rel?: string;
  target?: string;
  iconAlignment?: IconLinkAlignmentType;
  type?: LinkType;
  onClickReturn?: () => void;
  isDisabled?: boolean;
}

export const Links: React.FC<LinksProps> = ({
  children,
  label,
  onClickReturn,
  type,
  href,
  color = ODS_LINK_COLOR.primary,
  iconAlignment,
  className = '',
  ...props
}) => (
  <OdsLink
    className={className}
    href={href}
    onClick={onClickReturn}
    color={color}
    {...(iconAlignment && {
      iconAlignment: ODS_LINK_ICON_ALIGNMENT[iconAlignment],
    })}
    {...props}
    {...(type === LinkType.back && {
      icon: ODS_ICON_NAME.arrowLeft,
      iconAlignment: ODS_LINK_ICON_ALIGNMENT.left,
    })}
    {...(type === LinkType.next && { icon: ODS_ICON_NAME.arrowRight })}
    {...(type === LinkType.external && { icon: ODS_ICON_NAME.externalLink })}
    label={label ?? children}
  />
);

export default Links;
