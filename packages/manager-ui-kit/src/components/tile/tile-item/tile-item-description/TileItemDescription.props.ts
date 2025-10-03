import { ComponentProps } from 'react';

export type TileItemDescriptionProps = Omit<
  ComponentProps<'dd'>,
  'className'
> & {
  label?: string;
  divider?: boolean;
};
