import { ComponentPropsWithRef, ElementType, ReactNode } from 'react';

import { LinkProp as OdsLinkProp } from '@ovhcloud/ods-react';

export enum LinkType {
  back = 'back',
  next = 'next',
  external = 'external',
}

interface CustomLinkProps {
  // Customization props
  type?: LinkType;
  // IAM trigger props
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  disableIamCheck?: boolean;
}

export type LinkProps<T extends ElementType = 'a'> = CustomLinkProps &
  OdsLinkProp<T> &
  Omit<ComponentPropsWithRef<T>, keyof OdsLinkProp<T> | keyof CustomLinkProps>;

// Icon props types
type BackLinkProps = { type?: LinkType.back; children: ReactNode };
type ExternalLinkProps = { type?: LinkType.external; children: ReactNode };
type NextLinkProps = { type?: LinkType.next; children: ReactNode };

export type LinkIconsProps = BackLinkProps | ExternalLinkProps | NextLinkProps;
