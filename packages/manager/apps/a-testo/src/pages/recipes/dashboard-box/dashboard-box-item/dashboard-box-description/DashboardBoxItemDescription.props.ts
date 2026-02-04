import { ComponentProps } from 'react';

export type DashboardBoxItemDescriptionProps = Omit<
  ComponentProps<'dd'>,
  'className'
> & {
  label?: string;
  divider?: boolean;
};
