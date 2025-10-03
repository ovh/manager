import React from 'react';
import clsx from 'clsx';
import { Card, CARD_COLOR, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TileRootProps } from './TileRoot.props';
import { TileDivider } from '../tile-divider/TileDivider.component';

export const TileRoot = ({
  className,
  title,
  color = CARD_COLOR.neutral,
  children,
  ...props
}: TileRootProps) => {
  return (
    <Card
      className={clsx('w-full flex-col p-[1rem]', className ?? className)}
      color={color}
      {...props}
    >
      <section className="flex flex-col w-full">
        <Text preset={TEXT_PRESET.heading4}>{title}</Text>
        <TileDivider className="w-full" />
        <dl className="flex flex-col m-0">{children}</dl>
      </section>
    </Card>
  );
};
