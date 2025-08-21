import { Card, CardProp } from '@ovhcloud/ods-react';
import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { PciCardHeader } from '@/components/pciCard/PciCardHeader.component';
import { PciCardContent } from '@/components/pciCard/PciCardContent.component';
import { PciCardFooter } from '@/components/pciCard/PciCardFooter.component';

export type TPciCardProps = CardProp &
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
}: TPciCardProps) => {
  // TODO : fix badge background color with tailwind
  // TODO : replace #f3fdff by --ods-color-information-025 when the custom property is fixed
  const baseClasses = clsx(
    'flex flex-col gap-6',
    compact ? 'px-6 py-4' : 'p-6',
    {
      'cursor-not-allowed bg-[--ods-color-neutral-100] [&_*]:text-neutral-500 [&_[class^=_badge]]:bg-[--ods-color-neutral-500]': disabled,
      'hover:cursor-pointer border-[--ods-color-primary-600] bg-[#f3fdff]': selected,
      'hover:cursor-pointer hover:border-[--ods-color-primary-600] hover:bg-[#f3fdff]': selectable,
    },
    className,
  );

  return (
    <Card color={color} className={baseClasses} onClick={onClick}>
      {children}
    </Card>
  );
};

PciCard.Header = PciCardHeader;
PciCard.Content = PciCardContent;
PciCard.Footer = PciCardFooter;
