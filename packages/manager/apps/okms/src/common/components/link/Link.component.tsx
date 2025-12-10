import React from 'react';

import { useHref, useNavigate } from 'react-router-dom';

import { OdsLink } from '@ovhcloud/ods-components/react';

type OdsLinkProps = React.ComponentProps<typeof OdsLink> & {
  /** Display a OdsLink but uses the router for navigation */
  isRouterLink?: boolean;
};

export const Link = ({ isRouterLink, ...props }: OdsLinkProps) => {
  const navigate = useNavigate();
  const href = useHref(props.href);

  if (!isRouterLink) {
    return <OdsLink {...props} href={props.href} />;
  }

  return (
    <OdsLink
      {...props}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        props.onClick?.(event);
        navigate(props.href);
      }}
    />
  );
};
