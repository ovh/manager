import { Icon } from '@ovhcloud/ods-react';

import { LinkIconsProps, LinkType } from '@/components/link/Link.props';

export function LinkIcons({ type, children }: LinkIconsProps) {
  if (type == null) {
    return <>{children}</>;
  }

  switch (type) {
    case LinkType.back:
      return (
        <>
          <Icon name="arrow-left" />
          {children}
        </>
      );
    case LinkType.external:
      return (
        <>
          {children}
          <Icon name="external-link" />
        </>
      );
    case LinkType.next:
      return (
        <>
          {children}
          <Icon name="arrow-right" />
        </>
      );
    default:
      return <>{children}</>;
  }
}
