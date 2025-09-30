import clsx from 'clsx';
import React, { memo } from 'react';

type Props = React.HTMLAttributes<HTMLTableRowElement> & {
  disabled?: boolean;
};

export const FlavorsTableTr = memo(
  ({ className, disabled, children, ...rest }: Props) => {
    const trClasses = clsx(
      className,
      disabled &&
        'hover:cursor-not-allowed [&_td]:bg-[--ods-color-neutral-100] [&_th]:bg-[--ods-color-neutral-100] [&_p]:text-neutral-500',
    );

    return (
      <tr className={trClasses} aria-disabled={disabled} {...rest}>
        {children}
      </tr>
    );
  },
  (prev, next) =>
    prev.disabled === next.disabled &&
    prev.className === next.className &&
    prev.children === next.children,
);

FlavorsTableTr.displayName = 'FlavorsTableTr';
