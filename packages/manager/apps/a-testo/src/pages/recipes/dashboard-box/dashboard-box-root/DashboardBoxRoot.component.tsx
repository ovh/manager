import { clsx } from 'clsx';

import { CARD_COLOR, Card, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { DashboardBoxDivider } from '../dashboard-box-divider/DashboardBoxDivider.component';
import { DashboardBoxRootProps } from './DashboardBox.props';

export const DashboardBoxRoot = ({
  className,
  title,
  color = CARD_COLOR.neutral,
  children,
  ...props
}: DashboardBoxRootProps) => {
  return (
    <Card
      className={clsx('w-full flex-col p-[1rem]', className ?? className)}
      color={color}
      {...props}
    >
      <section className="flex flex-col w-full">
        <Text preset={TEXT_PRESET.heading4}>{title}</Text>
        <DashboardBoxDivider className="w-full" />
        <dl className="flex flex-col m-0">{children}</dl>
      </section>
    </Card>
  );
};
