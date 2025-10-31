import { DOMAttributes, JSX, ReactNode } from 'react';

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

type BackLinkProps = { type?: LinkType.back; children: ReactNode };
type ExternalLinkProps = { type?: LinkType.external; children: ReactNode };
type NextLinkProps = { type?: LinkType.next; children: ReactNode };

export type LinkIconsProps = BackLinkProps | ExternalLinkProps | NextLinkProps;
