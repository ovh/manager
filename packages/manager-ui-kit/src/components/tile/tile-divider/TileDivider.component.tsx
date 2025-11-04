import { DIVIDER_SPACING, Divider, DividerProp } from '@ovhcloud/ods-react';

export const TileDivider = (props: DividerProp) => (
  <Divider {...props} spacing={DIVIDER_SPACING._24} />
);
