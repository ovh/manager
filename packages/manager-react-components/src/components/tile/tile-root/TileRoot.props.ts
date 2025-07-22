import { ComponentProps } from 'react';
import { Card, CARD_COLOR } from '@ovhcloud/ods-react';

export interface TileRootProps extends ComponentProps<typeof Card> {
  className?: string;
  title: string;
  color?: CARD_COLOR;
}
