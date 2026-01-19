import { ComponentPropsWithoutRef, FC } from 'react';

import { Icon, Link, LinkProp } from '@ovhcloud/ods-react';

export const LinkWithArrow: FC<LinkProp & Omit<ComponentPropsWithoutRef<'a'>, keyof LinkProp>> = ({
  children,
  ...props
}) => {
  return (
    <Link {...props} className="gap-3">
      {children}
      <Icon name={'arrow-right'} />
    </Link>
  );
};
