import React from 'react';

import { useHref } from 'react-router-dom';

import clsx from 'clsx';

import { ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';

type OdsLinkProps = React.ComponentPropsWithoutRef<typeof Link>;

export type ActionLinkProps = {
  className?: string;
  path: string;
  isExternal?: boolean;
  isTargetBlank?: boolean;
  withBackArrow?: boolean;
  label: React.ReactNode;
} & Omit<OdsLinkProps, 'href' | 'className' | 'children'>;

export const ActionLink: React.FC<ActionLinkProps> = ({
  className,
  path,
  isExternal = false,
  isTargetBlank = false,
  withBackArrow = false,
  label,
  ...linkProps
}) => {
  const internalHref = useHref(path);
  const href = isExternal ? path : internalHref;

  return (
    <Link
      href={href}
      className={clsx(className)}
      {...(isTargetBlank && { target: '_blank' })}
      {...linkProps}
    >
      {withBackArrow && <Icon name={ICON_NAME.arrowLeft} />}
      {label}
      {isExternal && <Icon name="external-link" />}
    </Link>
  );
};
