import { HTMLAttributes, PropsWithChildren } from 'react';

import clsx from 'clsx';

import { Card, CardProp } from '@ovhcloud/ods-react';

import { PciCardContent } from './PciCardContent.component';
import { PciCardFooter } from './PciCardFooter.component';
import { PciCardHeader } from './PciCardHeader.component';

export type TPciCardProps = CardProp &
  HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    selectable?: boolean;
    selected?: boolean;
    disabled?: boolean;
    compact?: boolean;
  }>;

export const PciCard = ({
  color = 'neutral',
  selectable = false,
  selected = false,
  disabled = false,
  compact = false,
  className,
  children,
  onClick,
  ...rest
}: TPciCardProps) => {
  // TODO : fix badge background color with tailwind
  const baseClasses = clsx(
    'flex flex-col gap-6',
    compact ? 'px-6 py-4' : 'p-6',
    {
      'cursor-not-allowed bg-[--ods-color-neutral-100] [&_*]:text-neutral-500 [&_[class^=_badge]]:bg-[--ods-color-neutral-500]':
        disabled,
      'hover:cursor-pointer border-[--ods-color-primary-600] bg-[--ods-color-information-025]':
        selected,
      'hover:cursor-pointer hover:border-[--ods-color-primary-600]': selectable,
    },
    className,
  );

  return (
    <Card color={color} className={baseClasses} {...(!disabled && { onClick })} {...rest}>
      {children}
    </Card>
  );
};

PciCard.Header = PciCardHeader;
PciCard.Content = PciCardContent;
PciCard.Footer = PciCardFooter;
