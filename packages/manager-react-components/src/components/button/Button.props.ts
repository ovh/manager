import { ButtonProp } from '@ovhcloud/ods-react';
import { PropsWithChildren } from 'react';
import { TOOLTIP_POSITION } from '@ovhcloud/ods-react';

export type ButtonProps = PropsWithChildren<{
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
  children: JSX.Element | string;
  tooltipPosition?: TOOLTIP_POSITION;
}> &
  ButtonProp;
