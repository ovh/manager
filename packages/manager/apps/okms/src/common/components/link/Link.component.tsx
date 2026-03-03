import { type ComponentPropsWithRef } from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { Link as MukLink, LinkProps as MukLinkProps, LinkType as MukLinkType } from '@ovh-ux/muk';

type InternalLinkProps = Omit<ComponentPropsWithRef<typeof RouterLink>, 'as'> &
  MukLinkProps<typeof RouterLink>;

/**
 * InternalLink
 * Wrapper around MukLink component that uses React Router for client-side navigation.
 */
export function InternalLink({ ...props }: InternalLinkProps) {
  return <MukLink as={RouterLink} {...props} />;
}

/**
 * ExternalLink
 * Use MukLink component for external links.
 */
export function ExternalLink({ ...props }: MukLinkProps) {
  return <MukLink type={MukLinkType.external} {...props} target="_blank" />;
}

export const LinkType = MukLinkType;

export { MukLink };
