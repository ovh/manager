import { Divider, DIVIDER_SPACING, DividerProp } from '@ovhcloud/ods-react';

export const TileDivider = (props: DividerProp) => (
  <Divider {...props} spacing={DIVIDER_SPACING._24} />
);
