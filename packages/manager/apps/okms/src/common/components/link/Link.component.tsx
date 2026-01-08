import { type ComponentPropsWithRef } from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { Link, type LinkProp } from '@ovhcloud/ods-react';

import { Link as MukLink, LinkProps as MukLinkProps, LinkType as MukLinkType } from '@ovh-ux/muk';

type InternalLinkProps = Omit<ComponentPropsWithRef<typeof RouterLink>, 'as'> &
  LinkProp<typeof RouterLink>;

/**
 * InternalLink
 * Wrapper around the design-system Link component that uses React Router for client-side navigation.
 */
export function InternalLink({ ...props }: InternalLinkProps) {
  return <Link as={RouterLink} {...props} />;
}

/**
 * ExternalLink
 * Use MukLink component for external links.
 */
export function ExternalLink({ ...props }: MukLinkProps) {
  return <MukLink type={MukLinkType.external} {...props} target="_blank" />;
}

/**
 * MukLink
 * Export the Manager UI Kit Link component.
 * This is a temporary solution, the goal is to use only the InternalLink component for internal navigation.
 * TODO: Use MukLink in InternalLink to have only one link component for internal navigation.
 *       MukLink needs to be fixed to allow proper polymorphism.
 */
export { Link as MukLink } from '@ovh-ux/muk';
export { LinkType as MukLinkType } from '@ovh-ux/muk';
