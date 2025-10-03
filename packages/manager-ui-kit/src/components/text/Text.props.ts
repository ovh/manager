import { TextProp, TOOLTIP_POSITION } from '@ovhcloud/ods-react';
import { PropsWithChildren } from 'react';

export type TextProps = PropsWithChildren<{
  iamActions?: string[];
  urn?: string;
  tooltipPosition?: TOOLTIP_POSITION;
}> &
  TextProp;
