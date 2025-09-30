import { MouseEventHandler, PropsWithChildren } from 'react';
import clsx from "clsx";

type TFlavorsTableTrProps = React.HTMLAttributes<HTMLTableRowElement> & PropsWithChildren<{
  unavailable?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLTableRowElement>;
}>;

export const FlavorsTableTr = ({ unavailable= false, children, className, onClick }: TFlavorsTableTrProps) => {
  // TODO : fix badge background color with tailwind
  const baseClasses = clsx(
    className,
    unavailable && 'hover:cursor-not-allowed [&_*]:bg-[--ods-color-neutral-100] [&_*]:text-neutral-500 [&_[class^=_badge]]:bg-[--ods-color-neutral-500]'
  );

  const handleClick: MouseEventHandler<HTMLTableRowElement> = (event) => {
    if (unavailable) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <tr className={baseClasses} onClick={handleClick}>{children}</tr>
  )
};
