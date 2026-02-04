import { Divider, DividerProp, DIVIDER_SPACING } from '@ovhcloud/ods-react';

export const DashboardBoxDivider = (props: DividerProp) => (
  <Divider {...props} spacing={DIVIDER_SPACING._24} />
);
