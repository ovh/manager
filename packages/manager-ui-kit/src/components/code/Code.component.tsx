import { Code as OdsCode } from '@ovhcloud/ods-react';

import { CodeProps } from './Code.props';

export const Code = ({ children, ...others }: CodeProps) => (
  <OdsCode {...others}>{children}</OdsCode>
);
