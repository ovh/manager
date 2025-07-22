import { JSX, ComponentProps } from 'react';

export type TileItemTermProps = Omit<ComponentProps<'dt'>, 'className'> & {
  label: string;
  actions?: JSX.Element;
};
