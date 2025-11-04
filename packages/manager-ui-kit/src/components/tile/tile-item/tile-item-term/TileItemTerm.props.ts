import { ComponentProps, JSX } from 'react';

export type TileItemTermProps = Omit<ComponentProps<'dt'>, 'className'> & {
  label: string;
  tooltip?: string;
  actions?: JSX.Element;
};
