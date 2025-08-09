import React, { DOMAttributes } from 'react';
import { LinkProp } from '@ovhcloud/ods-react';

export enum LinkType {
  back = 'back',
  next = 'next',
  external = 'external',
}

export interface LinkProps extends LinkProp, DOMAttributes<HTMLAnchorElement> {
  className?: string;
  download?: string;
  label?: string;
  children?: string | JSX.Element;
  href?: string;
  rel?: string;
  target?: string;
  type?: LinkType;
  // Iam trigger
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
  disableIamCheck?: boolean;
}

export interface LinkIconsProps {
  type?: LinkType;
  children: React.ReactNode;
}
