import { ComponentProps, ReactNode } from 'react';

import { CARD_COLOR, Card } from '@ovhcloud/ods-react';

export interface TileRootProps extends ComponentProps<typeof Card> {
  className?: string;
  title: string;
  color?: CARD_COLOR;
  children?: ReactNode;
}
