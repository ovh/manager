import { ComponentProps, JSX } from 'react';

export type DashboardBoxItemTermProps = Omit<
  ComponentProps<'dt'>,
  'className'
> & {
  label: string;
  tooltip?: string;
  actions?: JSX.Element;
};
