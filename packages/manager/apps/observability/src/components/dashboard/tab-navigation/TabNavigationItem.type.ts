import { ComponentProps } from 'react';

import { Badge } from '@ovhcloud/ods-react';

export type TabNavigationItem = {
  name: string;
  url: string;
  title: string;
  badge?: {
    label: string;
    color: ComponentProps<typeof Badge>['color'];
  };
  disabled?: boolean;
};
