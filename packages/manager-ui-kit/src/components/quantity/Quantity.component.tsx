import { Quantity as OdsQuantity } from '@ovhcloud/ods-react';

import { QuantityProps } from '@/components';

export const Quantity = ({ children, ...others }: QuantityProps) => (
  <OdsQuantity {...others}>{children}</OdsQuantity>
);
