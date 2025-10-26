import React from 'react';

import { Icon } from '@ovhcloud/ods-react';

import { LinkIconsProps, LinkType } from '@/components/link/Link.props';

export const LinkIcons: React.FC<LinkIconsProps> = ({ type, children }) => (
  <>
    {type === LinkType.back && <Icon name="arrow-left" />}
    {children}
    {type === LinkType.external && <Icon name="external-link" />}
    {type === LinkType.next && <Icon name="arrow-right" />}
  </>
);
