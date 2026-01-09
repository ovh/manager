import { ComponentProps } from 'react';

import { Link as ReactRouterLink } from 'react-router-dom';

import { Link as OdsLink } from '@ovhcloud/ods-react';

type RouterLinkProps = ComponentProps<typeof OdsLink> & ComponentProps<'a'>;

export const RouterLink = (props: RouterLinkProps) => {
  return <OdsLink {...props} as={ReactRouterLink} to={props.href} />;
};
