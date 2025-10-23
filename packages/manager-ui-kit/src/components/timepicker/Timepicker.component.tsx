import { Timepicker as OdsTimepicker } from '@ovhcloud/ods-react';

import { TimepickerProps } from '@/components';

export const Timepicker = ({ children, ...others }: TimepickerProps) => (
  <OdsTimepicker {...others}>{children}</OdsTimepicker>
);
