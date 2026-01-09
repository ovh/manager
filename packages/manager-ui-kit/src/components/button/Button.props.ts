import { JSX, PropsWithChildren } from 'react';

import { ButtonProp, TOOLTIP_POSITION } from '@ovhcloud/ods-react';
import { BUTTON_PRESET } from './Button.constants';

export type ButtonProps = PropsWithChildren<{
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
  children: JSX.Element | string;
  tooltipPosition?: TOOLTIP_POSITION;
  preset?: BUTTON_PRESET;
  surveyApplicationKey?: string;
}> &
  ButtonProp;
