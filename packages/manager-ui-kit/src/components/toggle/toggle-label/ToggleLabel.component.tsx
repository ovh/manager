import { PropsWithChildren } from 'react';

import { ToggleLabel as ODSToggleLabel } from '@ovhcloud/ods-react';

import { ToggleLabelProps } from './ToggleLabel.props';

export const ToggleLabel = ({ children, ...props }: PropsWithChildren<ToggleLabelProps>) => (
  <ODSToggleLabel {...props}>{children}</ODSToggleLabel>
);
