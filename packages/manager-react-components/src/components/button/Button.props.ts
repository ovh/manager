import { PropsWithChildren } from 'react';
import { TOOLTIP_POSITION, ButtonProp } from '@ovhcloud/ods-react';

export type ButtonProps = PropsWithChildren<{
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
  children: JSX.Element | string;
  tooltipPosition?: TOOLTIP_POSITION;
}> &
  ButtonProp;
