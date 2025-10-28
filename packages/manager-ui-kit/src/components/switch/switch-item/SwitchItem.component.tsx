import { PropsWithChildren } from 'react';

import { SwitchItem as ODSSwitchItem } from '@ovhcloud/ods-react';

import { SwitchItemProps } from './SwitchItem.props';

export const SwitchItem = ({ children, ...props }: PropsWithChildren<SwitchItemProps>) => (
  <ODSSwitchItem {...props}>{children}</ODSSwitchItem>
);
