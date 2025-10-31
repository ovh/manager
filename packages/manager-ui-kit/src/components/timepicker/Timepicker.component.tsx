import { Timepicker as OdsTimepicker } from '@ovhcloud/ods-react';

import { TimepickerProps } from '@/components/timepicker/Timepicker.props';

export const Timepicker = ({ children, ...others }: TimepickerProps) => (
  <OdsTimepicker {...others}>{children}</OdsTimepicker>
);
