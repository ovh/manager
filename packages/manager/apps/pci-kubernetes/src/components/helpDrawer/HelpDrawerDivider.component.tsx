import { FC, HTMLAttributes } from 'react';

import { clsx } from 'clsx';

type HelpDrawerDividerProps = HTMLAttributes<HTMLDivElement>;

export const HelpDrawerDivider: FC<HelpDrawerDividerProps> = ({ className, ...props }) => {
  return (
    <div
      {...props}
      className={clsx('mx-4 my-3 inline-block w-px self-stretch bg-current', className)}
    />
  );
};
