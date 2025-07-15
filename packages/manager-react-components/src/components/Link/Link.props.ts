import React, { DOMAttributes } from 'react';
import { LinkProp } from '@ovhcloud/ods-react';

export enum LINK_TYPE {
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
  type?: LINK_TYPE;
  // Iam trigger
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
  disableIamCheck?: boolean;
}

export interface LinkIconsProps {
  type?: LINK_TYPE;
  children: React.ReactNode;
}
