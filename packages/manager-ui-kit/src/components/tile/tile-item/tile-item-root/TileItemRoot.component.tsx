import { ComponentProps } from 'react';

export const TileItemRoot = ({
  children,
  ...rest
}: Omit<ComponentProps<'div'>, 'className'>) => {
  return (
    <div className="flex flex-col gap-1" {...rest}>
      {children}
    </div>
  );
};
