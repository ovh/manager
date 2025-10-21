import { PropsWithChildren } from 'react';

import { TOOLTIP_POSITION, TextProp } from '@ovhcloud/ods-react';

export type TextProps = PropsWithChildren<{
  iamActions?: string[];
  urn?: string;
  tooltipPosition?: TOOLTIP_POSITION;
}> &
  TextProp;
