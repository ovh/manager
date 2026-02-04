import { ComponentProps } from 'react';

import { CARD_COLOR, Card } from '@ovhcloud/ods-react';

export interface DashboardBoxRootProps extends ComponentProps<typeof Card> {
  className?: string;
  title: string;
  color?: CARD_COLOR;
}
