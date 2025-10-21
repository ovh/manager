import { Icon, ICON_NAME, Link, type LinkProp } from '@ovhcloud/ods-react';
import React, { type ComponentPropsWithRef, type JSX } from 'react';

const ExternalLink = ({
  children,
  ...prop
}: LinkProp &
  Omit<ComponentPropsWithRef<'a'>, keyof LinkProp>): JSX.Element => {
  return (
    <Link {...prop} target="_blank">
      {children} <Icon name={ICON_NAME.externalLink} />
    </Link>
  );
};

export {
  ExternalLink,
};
