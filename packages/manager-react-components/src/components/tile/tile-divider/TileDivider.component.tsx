import { Divider, DIVIDER_SPACING, DividerProp } from '@ovhcloud/ods-react';

export const TileDivider = ({ ...rest }: DividerProp) => (
  <Divider spacing={DIVIDER_SPACING._24} {...rest} />
);
