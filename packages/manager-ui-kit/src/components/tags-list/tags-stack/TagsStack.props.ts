import { ElementRef } from 'react';

import { Badge } from '@ovhcloud/ods-react';

export type HTMLBadgeElement = ElementRef<typeof Badge>;

export type TagsStackProps = {
  tags: string[];
  maxLines?: number;
  onClick?: () => void;
};
