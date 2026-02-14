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
          <Icon name="arrow-left" aria-hidden="true" />
          {children}
        </>
      );
    case LinkType.external:
      return (
        <>
          {children}
          <Icon name="external-link" aria-hidden="true" />
        </>
      );
    case LinkType.next:
      return (
        <>
          {children}
          <Icon name="arrow-right" aria-hidden="true" />
        </>
      );
    case LinkType.survey:
      return (
        <>
          {children}
          <Icon name="emoticon-smile" aria-hidden="true" />
        </>
      );
    default:
      return <>{children}</>;
  }
}
